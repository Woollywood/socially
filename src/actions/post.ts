'use server';

import { prisma } from '@/lib/prisma';
import { getDbUserId } from './user';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

interface CreatePostFields {
	content: string;
}

interface CreatePostState {
	errors?: {
		content?: string[];
	};
	state?: CreatePostFields;
	response?: {
		status: number;
		message?: string;
	};
}

const createPostSchema = z.object({
	content: z.string().min(6, { message: 'Content must contain at least 6 characters' }).trim(),
});

export const createPost = async (prevState: CreatePostState, formData: FormData): Promise<CreatePostState> => {
	try {
		const formFields = {
			content: formData.get('content') as string,
		};
		const authorId = await getDbUserId();

		const { success, data, error } = createPostSchema.safeParse(formFields);

		if (!success) {
			return { errors: error.flatten().fieldErrors, state: formFields };
		}

		const { content } = data;

		try {
			await prisma.post.create({
				data: {
					content,
					authorId,
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
