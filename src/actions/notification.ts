'use server';

import { prisma } from '@/lib/prisma';
import { getDbUserId } from './user';

export const getNotifications = async () => {
	try {
		const dbUserId = await getDbUserId();
		if (!dbUserId) {
			throw new Error('Unauthenticated');
		}

		return await prisma.notification.findMany({
			where: {
				userId: dbUserId,
			},
			include: {
				creator: {
					select: {
						id: true,
						name: true,
						username: true,
						image: true,
					},
				},
				post: {
					select: {
						id: true,
						content: true,
						image: true,
					},
				},
				comment: {
					select: {
						id: true,
						content: true,
						createdAt: true,
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

export const markNotificationsAsRead = async (ids: string[]) => {
	try {
		await prisma.notification.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				read: true,
			},
		});
	} catch (error) {
		throw error;
	}
};
