import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { getUserByClerkId } from '@/actions/user';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LinkIcon, MapPinIcon } from 'lucide-react';

export const Sidebar: React.FC = async () => {
	const clerkUser = await currentUser();

	if (!clerkUser)
		return (
			<div className='sticky top-20'>
				<Card>
					<CardHeader>
						<CardTitle className='text-center text-xl font-semibold'>Welcome Back!</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='mb-4 text-center text-muted-foreground'>
							Login to access your profile and connect with others.
						</p>
						<SignInButton mode='modal'>
							<Button className='w-full' variant='outline'>
								Login
							</Button>
						</SignInButton>
						<SignUpButton mode='modal'>
							<Button className='mt-2 w-full' variant='default'>
								Sign Up
							</Button>
						</SignUpButton>
					</CardContent>
				</Card>
			</div>
		);

	const user = await getUserByClerkId(clerkUser.id);

	if (!user) {
		throw new Error('Cannot find user');
	}

	return (
		<aside className='sticky top-20'>
			{' '}
			<Card>
				<CardContent className='pt-6'>
					<div className='flex flex-col items-center text-center'>
						<Link href={`/profile/${user.username}`} className='flex flex-col items-center justify-center'>
							<Avatar className='h-20 w-20 border-2'>
								<AvatarImage src={user.image || '/avatar.png'} />
							</Avatar>

							<div className='mt-4 space-y-1'>
								<h3 className='font-semibold'>{user.name}</h3>
								<p className='text-sm text-muted-foreground'>{user.username}</p>
							</div>
						</Link>

						{user.bio && <p className='mt-3 text-sm text-muted-foreground'>{user.bio}</p>}

						<div className='w-full'>
							<Separator className='my-4' />
							<div className='flex justify-between'>
								<div>
									<p className='font-medium'>{user._count.following}</p>
									<p className='text-xs text-muted-foreground'>Following</p>
								</div>
								<Separator orientation='vertical' />
								<div>
									<p className='font-medium'>{user._count.followers}</p>
									<p className='text-xs text-muted-foreground'>Followers</p>
								</div>
							</div>
							<Separator className='my-4' />
						</div>

						<div className='w-full space-y-2 text-sm'>
							<div className='flex items-center text-muted-foreground'>
								<MapPinIcon className='mr-2 h-4 w-4' />
								{user.location || 'No location'}
							</div>
							<div className='flex items-center text-muted-foreground'>
								<LinkIcon className='mr-2 h-4 w-4 shrink-0' />
								{user.website ? (
									<a href={`${user.website}`} className='truncate hover:underline' target='_blank'>
										{user.website}
									</a>
								) : (
									'No website'
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</aside>
	);
};
