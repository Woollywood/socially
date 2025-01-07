'use client'; // Error boundaries must be Client Components

import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { Button } from '@/components/ui/button';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		// global-error must include html and body tags
		<html>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<div className='flex min-h-screen flex-col items-center justify-center'>
					<h2 className='mb-12 text-4xl font-medium'>Something went wrong!</h2>
					<Button onClick={() => reset()}>Try again</Button>
				</div>
			</body>
		</html>
	);
}
