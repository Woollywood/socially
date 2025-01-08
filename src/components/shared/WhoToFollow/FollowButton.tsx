'use client';

import React, { useTransition } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { toggleFollow } from '@/actions/user';

interface Props {
	isFollowing: boolean;
	followingId: string;
}

export const FollowButton: React.FC<Props> = ({ isFollowing, followingId }) => {
	const [isPending, startTransition] = useTransition();
	const handleDispatch = () => {
		startTransition(async () => {
			const state = await toggleFollow(followingId);
			if (state) {
				const { status, message } = state;
				if (status === 200) {
					toast.success(message);
				} else {
					toast.error(message);
				}
			}
		});
	};

	return (
		<Button size='sm' variant='secondary' disabled={isPending} className='w-20' onClick={handleDispatch}>
			{isPending ? <Loader2Icon className='size-4 animate-spin' /> : isFollowing ? 'Unfollow' : 'Follow'}
		</Button>
	);
};
