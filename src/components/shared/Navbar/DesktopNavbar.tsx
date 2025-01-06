import React from 'react';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { ThemeToggler } from '../ThemeToggler';
import { Button } from '@/components/ui/button';
import { BellIcon, HomeIcon, UserIcon } from 'lucide-react';
import { SignInButton, UserButton } from '@clerk/nextjs';

export const DesktopNavbar: React.FC = async () => {
	const user = await currentUser();

	return (
		<div className='hidden items-center space-x-4 md:flex'>
			<ThemeToggler />

			<Button variant='ghost' className='flex items-center gap-2' asChild>
				<Link href='/'>
					<HomeIcon className='h-4 w-4' />
					<span className='hidden lg:inline'>Home</span>
				</Link>
			</Button>

			{user ? (
				<>
					<Button variant='ghost' className='flex items-center gap-2' asChild>
						<Link href='/notifications'>
							<BellIcon className='h-4 w-4' />
							<span className='hidden lg:inline'>Notifications</span>
						</Link>
					</Button>
					<Button variant='ghost' className='flex items-center gap-2' asChild>
						<Link href={`/profile/${user.username ?? user.emailAddresses[0].emailAddress.split('@')[0]}`}>
							<UserIcon className='h-4 w-4' />
							<span className='hidden lg:inline'>Profile</span>
						</Link>
					</Button>
					<UserButton />
				</>
			) : (
				<SignInButton mode='modal'>
					<Button variant='default'>Sign In</Button>
				</SignInButton>
			)}
		</div>
	);
};
