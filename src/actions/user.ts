'use server';

import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const syncUser = async () => {
	try {
		const { userId } = await auth();
		const user = await currentUser();

		if (!userId || !user) {
			return;
		}

		if (await prisma.user.findUnique({ where: { clerkId: userId } })) {
			return;
		}

		return await prisma.user.create({
			data: {
				clerkId: userId,
				name: [user.firstName || '', user.lastName || ''].join(' '),
				username: user.username ?? user.emailAddresses[0].emailAddress.split('@')[0],
				email: user.emailAddresses[0].emailAddress,
				image: user.imageUrl,
			},
		});
	} catch (error) {
		throw error;
	}
};

export const getUserByClerkId = async (clerkId: string) => {
	return await prisma.user.findUnique({
		where: { clerkId },
		include: { _count: { select: { followers: true, following: true, posts: true } } },
	});
};

export const getDbUserId = async () => {
	const { userId: clerkId } = await auth();
	if (!clerkId) {
		throw new Error('Unauthenticated');
	}

	const user = await getUserByClerkId(clerkId);
	if (!user) {
		throw new Error('User not found');
	}
	return user.id;
};

export const getFollowsRecommendations = async () => {
	try {
		const userId = await getDbUserId();
		return await prisma.user.findMany({
			where: {
				AND: [{ NOT: { id: userId } }],
			},
			select: {
				id: true,
				name: true,
				username: true,
				image: true,
				_count: {
					select: {
						followers: true,
					},
				},
			},
			take: 3,
		});
	} catch (error) {
		throw error;
	}
};

export const toggleFollow = async (followingId: string) => {
	try {
		const followerId = await getDbUserId();

		if (followerId === followingId) {
			return { status: 500, message: 'Your cannot follow yourself' };
		}
		const existingFollow = await prisma.follows.findUnique({
			where: {
				followerId_followingId: {
					followerId,
					followingId,
				},
			},
		});

		if (existingFollow) {
			await prisma.follows.delete({
				where: {
					followerId_followingId: {
						followerId,
						followingId,
					},
				},
			});
			revalidatePath('/');
			return { status: 200, message: 'User unfollowed successfully' };
		} else {
			await prisma.$transaction([
				prisma.follows.create({ data: { followerId, followingId } }),
				prisma.notification.create({ data: { type: 'FOLLOW', userId: followingId, creatorId: followerId } }),
			]);
			revalidatePath('/');
			return { status: 200, message: 'User followed successfully' };
		}
	} catch (error) {
		return { status: 500, message: (error as Error).message };
	}
};
