'use client';

import React, { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { toggleFollow } from '@/actions/user';
import toast from 'react-hot-toast';

interface Props {
	isFollowing: boolean;
	followingId: string;
}

export const FollowButton: React.FC<Props> = ({ isFollowing, followingId }) => {
	const [state, dispatch, isPending] = useActionState(toggleFollow, undefined);

	useEffect(() => {
		if (state) {
			const { status, message } = state;
			if (status === 200) {
				toast.success(message);
			} else {
				toast.error(message);
			}
		}
	}, [state]);

	return (
		<form action={dispatch}>
			<input type='hidden' name='followingId' defaultValue={followingId} />
			<Button size='sm' variant='secondary' disabled={isPending} className='w-20'>
				{isPending ? <Loader2Icon className='size-4 animate-spin' /> : isFollowing ? 'Unfollow' : 'Follow'}
			</Button>
		</form>
	);
};
