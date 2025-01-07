import React from 'react';
import { FollowButton } from './FollowButton';
import { getDbUserId, getFollowsRecommendations } from '@/actions/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { prisma } from '@/lib/prisma';

export const WhoToFollow: React.FC = async () => {
	const users = await getFollowsRecommendations();

	if (users.length === 0) {
		return null;
	}

	const userId = await getDbUserId();
	const followingIds = await prisma.follows
		.findMany({
			where: { followerId: userId },
			select: { followingId: true },
		})
		.then((data) => data.map((item) => item.followingId));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Who to Follow</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{users.map((user) => (
						<div key={user.id} className='flex items-center justify-between gap-2'>
							<div className='flex items-center gap-1'>
								<Link href={`/profile/${user.username}`}>
									<Avatar>
										<AvatarImage src={user.image ?? '/avatar.png'} />
									</Avatar>
								</Link>
								<div className='text-xs'>
									<Link href={`/profile/${user.username}`} className='cursor-pointer font-medium'>
										{user.name}
									</Link>
									<p className='text-muted-foreground'>@{user.username}</p>
									<p className='text-muted-foreground'>{user._count.followers} followers</p>
								</div>
							</div>
							<FollowButton isFollowing={followingIds.includes(user.id)} followingId={user.id} />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
