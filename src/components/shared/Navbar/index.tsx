import React from 'react';
import Link from 'next/link';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileNavbar } from './MobileNavbar';

export const Navbar: React.FC = () => {
	return (
		<nav className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='mx-auto max-w-7xl px-4'>
				<div className='flex h-16 items-center justify-between'>
					<div className='flex items-center'>
						<Link href='/' className='font-mono text-xl font-bold tracking-wider text-primary'>
							Socially
						</Link>
					</div>
					<DesktopNavbar />
					<MobileNavbar />
				</div>
			</div>
		</nav>
	);
};
