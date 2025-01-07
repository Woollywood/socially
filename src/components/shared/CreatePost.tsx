'use client';

import React, { useActionState, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { ImageIcon, Loader2Icon, SendIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { createPost } from '@/actions/post';
import { ErrorMessage } from '../ui/form/ErrorMessage';

export const CreatePost: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
	const { user } = useUser();
	const [showImageUpload, setShowImageUpload] = useState(false);

	const [state, dispatch, isPending] = useActionState(createPost, {});

	useEffect(() => {
		if (state.response) {
			const response = state.response;
			if (response.status !== 200) {
				toast.error(response.message);
			} else if (response.status === 200) {
				toast.success(response.message);
			}
		}
	}, [state]);

	return (
		<Card {...props}>
			<CardContent className='pt-6'>
				<form action={dispatch}>
					<div className='flex gap-4 space-y-4'>
						<Avatar className='h-12 w-12 border-2'>
							<AvatarImage src={user?.imageUrl || '/avatar.png'} />
						</Avatar>
						<div className='w-full'>
							<Textarea
								name='content'
								placeholder="What's on your mind?"
								className='min-h-[6.25rem] resize-none border-none p-0 text-base focus-visible:ring-0'
								defaultValue={state?.state?.content}
								disabled={isPending}
							/>
							<ErrorMessage errors={state.errors?.content} />
						</div>
					</div>
					<div className='flex items-center justify-between border-t pt-4'>
						<div className='flex space-x-2'>
							<Button
								type='button'
								variant='ghost'
								size='sm'
								className='text-muted-foreground hover:text-primary'
								onClick={() => setShowImageUpload(!showImageUpload)}
								disabled={isPending}>
								<ImageIcon className='mr-2 size-4' />
								Photo
							</Button>
						</div>
						<Button className='flex items-center' disabled={isPending}>
							{isPending ? (
								<>
									<Loader2Icon className='mr-2 size-4 animate-spin' />
									Posting...
								</>
							) : (
								<>
									<SendIcon className='mr-2 size-4' />
									Post
								</>
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
