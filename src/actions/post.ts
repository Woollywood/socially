'use server';

import { prisma } from '@/lib/prisma';
import { getDbUserId } from './user';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

interface CreatePostFields {
	content: string;
	image: string | null;
}

interface CreatePostState {
	errors?: {
		content?: string[];
		image?: string[];
	};
	state?: CreatePostFields;
	response?: {
		status: number;
		message?: string;
	};
}

const createPostSchema = z.object({
	content: z.string().min(6, { message: 'Content must contain at least 6 characters' }).trim(),
	image: z.string().nullable(),
});

export const createPost = async (prevState: CreatePostState, formData: FormData): Promise<CreatePostState> => {
	try {
		const formFields = {
			content: formData.get('content') as string,
			image: formData.get('image') as string,
		};

		const authorId = await getDbUserId();

		const { success, data, error } = createPostSchema.safeParse(formFields);

		if (!success) {
			return { errors: error.flatten().fieldErrors, state: formFields };
		}

		const { content, image } = data;

		try {
			await prisma.post.create({
				data: {
					authorId,
					content,
					image,
				},
			});
		} catch (error) {
			return { state: data, response: { status: 500, message: (error as Error).message } };
		}

		revalidatePath('/');
		return { response: { status: 200, message: 'post created successfully' } };
	} catch (error) {
		return { response: { status: 500, message: (error as Error).message } };
	}
};

export const getPosts = async () => {
	return await prisma.post.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			author: {
				select: {
					id: true,
					name: true,
					image: true,
					username: true,
				},
			},
			comments: {
				include: {
					author: {
						select: {
							id: true,
							username: true,
							image: true,
							name: true,
						},
					},
				},
				orderBy: {
					createdAt: 'asc',
				},
			},
			likes: {
				select: {
					userId: true,
				},
			},
			_count: {
				select: {
					likes: true,
					comments: true,
				},
			},
		},
	});
};

export const deletePost = async (
	post: Awaited<ReturnType<typeof getPosts>>[number],
): Promise<{ status: number; message: string }> => {
	const { id, author } = post;

	const dbUserId = await getDbUserId();
	if (author.id !== dbUserId) {
		return { status: 500, message: 'Access denied' };
	}

	try {
		await prisma.post.delete({ where: { id } });
		revalidatePath('/');
		return { status: 200, message: 'Post deleted successfully' };
	} catch (error) {
		return { status: 500, message: (error as Error).message };
	}
};

export const toggleLikePost = async (postId: string): Promise<{ status: number; message: string }> => {
	try {
		const userId = await getDbUserId();
		if (!userId) {
			throw new Error('Unauthenticated');
		}

		const existingLike = await prisma.like.findUnique({
			where: {
				userId_postId: {
					userId,
					postId,
				},
			},
		});

		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: { authorId: true },
		});

		if (!post) {
			throw new Error('Post not found');
		}

		if (existingLike) {
			await prisma.like.delete({
				where: {
					userId_postId: {
						userId,
						postId,
					},
				},
			});
		} else {
			await prisma.$transaction([
				prisma.like.create({
					data: {
						userId,
						postId,
					},
				}),
				...(post.authorId !== userId
					? [
							prisma.notification.create({
								data: {
									type: 'LIKE',
									userId: post.authorId,
									creatorId: userId,
									postId,
								},
							}),
						]
					: []),
			]);
		}

		revalidatePath('/');
		return { status: 200, message: 'success' };
	} catch (error) {
		return { status: 500, message: (error as Error).message };
	}
};

interface CreateCommentFields {
	content: string;
}

type CreateCommentState =
	| {
			errors?: {
				content?: string[];
			};
			state?: CreateCommentFields;
			response?: {
				status: number;
				message?: string;
			};
	  }
	| undefined;

const createCommentSchema = z.object({
	content: z.string().min(1).trim(),
});

export const createComment = async (prevState: CreateCommentState, formData: FormData): Promise<CreateCommentState> => {
	try {
		const userId = await getDbUserId();
		if (!userId) {
			throw new Error('Unauthenticated');
		}

		const formFields = {
			content: formData.get('content') as string,
			postId: formData.get('postId') as string,
		};
		const { postId } = formFields;

		const { success, data, error } = createCommentSchema.safeParse(formFields);

		if (!success) {
			return { errors: error.flatten().fieldErrors, state: formFields };
		}

		const { content } = data;

		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: { authorId: true },
		});
		if (!post) {
			throw new Error('Post not found');
		}

		await prisma.$transaction(async (tx) => {
			const newComment = await tx.comment.create({
				data: {
					content,
					authorId: userId,
					postId,
				},
			});

			if (post.authorId !== userId) {
				await tx.notification.create({
					data: {
						type: 'COMMENT',
						userId: post.authorId,
						creatorId: userId,
						postId,
						commentId: newComment.id,
					},
				});
			}

			return [newComment];
		});

		revalidatePath('/');
		return { response: { status: 200, message: 'Success' } };
	} catch (error) {
		return { response: { status: 500, message: (error as Error).message } };
	}
};
