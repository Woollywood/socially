import React from 'react';
import moment from 'moment';
import { getProfileByUsername, isFollowing } from '@/actions/profile';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { CalendarIcon, LinkIcon, MapPinIcon } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/actions/user';
import { ProfileUserDialog } from './ProfileUserDialog';
import { ProfileFollowingButton } from './ProfileFollowingButton';

interface Props {
	username: string;
}

export const ProfileUser: React.FC<Props> = async ({ username }) => {
	const user = await getProfileByUsername(username);
	const clerkUser = await currentUser();

	if (!user || !clerkUser) {
		notFound();
	}

	const currentUserObject = await getUserByClerkId(clerkUser.id);
	const isOwnProfile = currentUserObject?.id === user.id;
	const isUserFollowing = await isFollowing(user.id);

	return (
		<div className='mx-auto w-full max-w-lg'>
			<Card className='bg-card'>
				<CardContent className='pt-6'>
					<div className='flex flex-col items-center text-center'>
						<Avatar className='h-24 w-24'>
							<AvatarImage src={user.image ?? '/avatar.png'} />
						</Avatar>
						<h1 className='mt-4 text-2xl font-bold'>{user.name ?? user.username}</h1>
						<p className='text-muted-foreground'>@{user.username}</p>
						<p className='mt-2 text-sm'>{user.bio}</p>

						<div className='mt-6 w-full'>
							<div className='mb-4 flex justify-between'>
								<div>
									<div className='font-semibold'>{user._count.following.toLocaleString()}</div>
									<div className='text-sm text-muted-foreground'>Following</div>
								</div>
								<Separator orientation='vertical' />
								<div>
									<div className='font-semibold'>{user._count.followers.toLocaleString()}</div>
									<div className='text-sm text-muted-foreground'>Followers</div>
								</div>
								<Separator orientation='vertical' />
								<div>
									<div className='font-semibold'>{user._count.posts.toLocaleString()}</div>
									<div className='text-sm text-muted-foreground'>Posts</div>
								</div>
							</div>
						</div>

						{!currentUserObject ? (
							<SignInButton mode='modal'>
								<Button className='mt-4 w-full'>Follow</Button>
							</SignInButton>
						) : isOwnProfile ? (
							<ProfileUserDialog user={user} />
						) : (
							<ProfileFollowingButton user={user} isFollowing={isUserFollowing} />
						)}

						<div className='mt-6 w-full space-y-2 text-sm'>
							{user.location && (
								<div className='flex items-center text-muted-foreground'>
									<MapPinIcon className='mr-2 size-4' />
									{user.location}
								</div>
							)}
							{user.website && (
								<div className='flex items-center text-muted-foreground'>
									<LinkIcon className='mr-2 size-4' />
									<a
										href={
											user.website.startsWith('http') ? user.website : `https://${user.website}`
										}
										className='hover:underline'
										target='_blank'
										rel='noopener noreferrer'>
										{user.website}
									</a>
								</div>
							)}
							<div className='flex items-center text-muted-foreground'>
								<CalendarIcon className='mr-2 size-4' />
								Joined {moment(user.createdAt).fromNow()}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
