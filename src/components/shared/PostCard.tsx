'use client';

import React, { startTransition, useActionState, useOptimistic, useState, useTransition } from 'react';
import { Card, CardContent } from '../ui/card';
import Link from 'next/link';
import { Avatar, AvatarImage } from '../ui/avatar';
import { createComment, deletePost, getPosts, toggleLikePost } from '@/actions/post';
import moment from 'moment';
import { DeleteAlertDialog } from './Alerts/DeleteAlertDialog';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Button } from '../ui/button';
import { HeartIcon, MessageCircleIcon, SendIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { Textarea } from '../ui/textarea';

interface Props {
	post: Awaited<ReturnType<typeof getPosts>>[number];
	dbUserId: string;
}

export const PostCard: React.FC<Props> = ({ post, dbUserId }) => {
	const { user } = useUser();

	const [isDeleting, startDeleting] = useTransition();
	const handleDelete = () => {
		startDeleting(async () => {
			const { status, message } = await deletePost(post);
			if (status === 200) {
				toast.success(message);
			} else {
				toast.error(message);
			}
		});
	};

	const [optimisticLikes, addOptimisticLike] = useOptimistic<{ userId: string }[], string>(
		post.likes,
		(currentState, optimisticValue) => {
			if (currentState.some((like) => like.userId === dbUserId)) {
				return currentState.filter((like) => like.userId !== dbUserId);
			}

			return [...currentState, { userId: optimisticValue }];
		},
	);
	const optimisticLikesCount = optimisticLikes.length;
	const hasLiked = optimisticLikes.some((like) => like.userId === dbUserId);
	const likeAction = () => {
		startTransition(async () => {
			addOptimisticLike(dbUserId);
			await toggleLikePost(post.id);
		});
	};

	const [showComments, setShowComments] = useState(false);
	const [, dispatch, isCommentPending] = useActionState(createComment, undefined);
	const [comment, setComment] = useState('');
	const isCommentDisabled = isCommentPending || comment.trim().length === 0;

	return (
		<Card className='overflow-hidden'>
			<CardContent className='p-4 sm:p-6'>
				<div className='space-y-4'>
					<div className='flex space-x-3 sm:space-x-4'>
						<Link href={`/profile/${post.author.username}`}>
							<Avatar className='size-8 sm:size-10'>
								<AvatarImage src={post.author.image ?? '/avatar.png'} />
							</Avatar>
						</Link>

						<div className='min-w-0 flex-1'>
							<div className='flex flex-shrink-0 items-start justify-between gap-4'>
								<div className='mb-4'>
									<Link
										href={`/profile/${post.author.username}`}
										className='flex flex-col truncate sm:flex-row sm:items-center sm:space-x-2'>
										{(post.author.name?.trim().length || 0) > 0 && (
											<span className='truncate font-semibold'>{post.author.name}</span>
										)}
										<span className='text-sm text-muted-foreground'>@{post.author.username}</span>
									</Link>
									<span className='text-[0.75rem] leading-3 text-muted-foreground'>
										{moment(post.createdAt).fromNow()}
									</span>
								</div>
								{/* Check if current user is the post author */}
								{dbUserId === post.author.id && (
									<div className='flex flex-shrink-0 items-center justify-center'>
										<DeleteAlertDialog onDelete={handleDelete} isDeleting={isDeleting} />
									</div>
								)}
							</div>
							<p className='mt-2 break-words text-sm text-foreground'>{post.content}</p>
						</div>
					</div>

					{post.image && (
						<div className='overflow-hidden rounded-lg'>
							<Image src={post.image} alt='Post content' className='h-auto w-full object-cover' />
						</div>
					)}

					<div className='flex items-center space-x-4 pt-2'>
						<Button
							variant='ghost'
							size='sm'
							className={`gap-2 text-muted-foreground ${
								hasLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'
							}`}
							onClick={likeAction}>
							{hasLiked ? (
								<HeartIcon className='size-5 fill-current' />
							) : (
								<HeartIcon className='size-5' />
							)}
							<span>{optimisticLikesCount}</span>
						</Button>

						<Button
							variant='ghost'
							size='sm'
							className='gap-2 text-muted-foreground hover:text-blue-500'
							onClick={() => setShowComments((prev) => !prev)}>
							<MessageCircleIcon
								className={`size-5 ${showComments ? 'fill-blue-500 text-blue-500' : ''}`}
							/>
							<span>{post.comments.length}</span>
						</Button>
					</div>

					{showComments && (
						<div className='space-y-4 border-t pt-4'>
							<div className='space-y-4'>
								{post.comments.map((comment) => (
									<div key={comment.id} className='flex space-x-3'>
										<Avatar className='size-8 flex-shrink-0'>
											<AvatarImage src={comment.author.image ?? '/avatar.png'} />
										</Avatar>
										<div className='min-w-0 flex-1'>
											<div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
												<span className='text-sm font-medium'>{comment.author.name}</span>
												<span className='text-sm text-muted-foreground'>
													@{comment.author.username}
												</span>
												<span className='text-sm text-muted-foreground'>·</span>
												<span className='text-sm text-muted-foreground'>
													{moment(comment.createdAt).fromNow()}
												</span>
											</div>
											<p className='break-words text-sm'>{comment.content}</p>
										</div>
									</div>
								))}
							</div>

							<div className='flex space-x-3'>
								<Avatar className='size-8 flex-shrink-0'>
									<AvatarImage src={user?.imageUrl || '/avatar.png'} />
								</Avatar>
								<form className='flex-1' action={dispatch}>
									<input type='hidden' name='postId' defaultValue={post.id} />
									<Textarea
										placeholder='Write a comment...'
										name='content'
										className='min-h-[80px] resize-none'
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>
									<div className='mt-2 flex justify-end'>
										<Button
											size='sm'
											className='flex items-center gap-2'
											disabled={isCommentDisabled}>
											{isCommentPending ? (
												'Posting...'
											) : (
												<>
													<SendIcon className='size-4' />
													Comment
												</>
											)}
										</Button>
									</div>
								</form>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
