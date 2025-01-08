'use server'

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getDbUserId } from './user';

export const getProfileByUsername = async (username: string) => {
	try {
		return await prisma.user.findUnique({
			where: {
				username,
			},
			select: {
				id: true,
				name: true,
				username: true,
				bio: true,
				image: true,
				location: true,
				createdAt: true,
				website: true,
				_count: {
					select: {
						followers: true,
						following: true,
						posts: true,
					},
				},
			},
		});
	} catch (error) {
		throw error;
	}
};

export const getUserPosts = async (userId: string) => {
	try {
		return await prisma.post.findMany({
			where: {
				authorId: userId,
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						username: true,
						image: true,
					},
				},
				comments: {
					include: {
						author: {
							select: {
								id: true,
								name: true,
								username: true,
								image: true,
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
			orderBy: {
				createdAt: 'desc',
			},
		});
	} catch (error) {
		throw error;
	}
};

export const getUserLikedPosts = async (userId: string) => {
	try {
		return await prisma.post.findMany({
			where: {
				likes: {
					some: {
						userId,
					},
				},
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						username: true,
						image: true,
					},
				},
				comments: {
					include: {
						author: {
							select: {
								id: true,
								name: true,
								username: true,
								image: true,
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
			orderBy: {
				createdAt: 'desc',
			},
		});
	} catch (error) {
		throw error;
	}
};

interface UpdateUserFields {
	name: string;
	bio: string;
	location: string;
	website: string;
}

type UpdateUserState =
	| {
			errors?: {
				name?: string[];
				bio?: string[];
				location?: string[];
				website?: string[];
			};
			state?: UpdateUserFields;
			response?: {
				status: number;
				message?: string;
			};
	  }
	| undefined;

const updateUserSchema = z.object({
	name: z.string().min(3, { message: 'Must contain at least 3 characters' }).trim(),
	bio: z.string().min(1, { message: 'Required' }).trim(),
	location: z.string().min(1, { message: 'Required' }).trim(),
	website: z.string().min(1, { message: 'Required' }).trim(),
});

export const updateUserProfile = async (formData: FormData): Promise<UpdateUserState> => {
	const formFields = {
		name: formData.get('name') as string,
		bio: formData.get('bio') as string,
		location: formData.get('location') as string,
		website: formData.get('website') as string,
	};

	try {
		const { userId: clerkId } = await auth();
		if (!clerkId) {
			throw new Error('Unauthenticated');
		}

		const { success, data, error } = updateUserSchema.safeParse(formFields);

		if (!success) {
			return { errors: error.flatten().fieldErrors, state: formFields };
		}

		const { name, bio, location, website } = data;
		await prisma.user.update({
			where: { clerkId },
			data: {
				name,
				bio,
				location,
				website,
			},
		});

		revalidatePath('/profile');
		return { state: data, response: { status: 200, message: 'Success' } };
	} catch (error) {
		return { state: formFields, response: { status: 500, message: (error as Error).message } };
	}
};

export const isFollowing = async (userId: string) => {
	try {
		const currentUserId = await getDbUserId();
		if (!currentUserId) {
			throw new Error('unauthenticated');
		}

		return !!(await prisma.follows.findUnique({
			where: {
				followerId_followingId: {
					followerId: currentUserId,
					followingId: userId,
				},
			},
		}));
	} catch (error) {
		throw error;
	}
};
