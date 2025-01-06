'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SignInButton, SignOutButton, useAuth } from '@clerk/nextjs';
import { BellIcon, HomeIcon, LogOutIcon, MenuIcon, MoonIcon, SunIcon, UserIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export const MobileNavbar: React.FC = () => {
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const { isSignedIn } = useAuth();
	const { theme, setTheme } = useTheme();

	return (
		<div className='flex items-center space-x-2 md:hidden'>
			<Button
				variant='ghost'
				size='icon'
				onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
				className='mr-2'>
				<SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
				<MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
				<span className='sr-only'>Toggle theme</span>
			</Button>

			<Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
				<SheetTrigger asChild>
					<Button variant='ghost' size='icon'>
						<MenuIcon className='h-5 w-5' />
					</Button>
				</SheetTrigger>
				<SheetContent side='right' className='w-[300px]'>
					<SheetHeader>
						<SheetTitle>Menu</SheetTitle>
					</SheetHeader>
					<nav className='mt-6 flex flex-col space-y-4'>
						<Button variant='ghost' className='flex items-center justify-start gap-3' asChild>
							<Link href='/'>
								<HomeIcon className='h-4 w-4' />
								Home
							</Link>
						</Button>

						{isSignedIn ? (
							<>
								<Button variant='ghost' className='flex items-center justify-start gap-3' asChild>
									<Link href='/notifications'>
										<BellIcon className='h-4 w-4' />
										Notifications
									</Link>
								</Button>
								<Button variant='ghost' className='flex items-center justify-start gap-3' asChild>
									<Link href='/profile'>
										<UserIcon className='h-4 w-4' />
										Profile
									</Link>
								</Button>
								<SignOutButton>
									<Button variant='ghost' className='flex w-full items-center justify-start gap-3'>
										<LogOutIcon className='h-4 w-4' />
										Logout
									</Button>
								</SignOutButton>
							</>
						) : (
							<SignInButton mode='modal'>
								<Button variant='default' className='w-full'>
									Sign In
								</Button>
							</SignInButton>
						)}
					</nav>
				</SheetContent>
			</Sheet>
		</div>
	);
};
