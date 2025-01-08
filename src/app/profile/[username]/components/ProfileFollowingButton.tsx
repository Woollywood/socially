'use client';

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { getProfileByUsername } from '@/actions/profile';
import { toggleFollow } from '@/actions/user';

interface Props {
	user: NonNullable<Awaited<ReturnType<typeof getProfileByUsername>>>;
	isFollowing: boolean;
}

export const ProfileFollowingButton: React.FC<Props> = ({ user, isFollowing }) => {
	const [isPending, startTransition] = useTransition();
	const handleFollow = () => {
		startTransition(async () => {
			await toggleFollow(user.id);
		});
	};

	return (
		<Button
			className='mt-4 w-full'
			onClick={handleFollow}
			disabled={isPending}
			variant={isFollowing ? 'outline' : 'default'}>
			{isFollowing ? 'Unfollow' : 'Follow'}
		</Button>
	);
};
