import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Navbar } from '@/components/shared/Navbar';
import { Sidebar } from '@/components/shared/Sidebar';
import { Toaster } from 'react-hot-toast';
import { syncUser } from '@/actions/user';

import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/app/api/uploadthing/core';

import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Socially',
	description: 'A modern social media application powered by Next.js',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	await syncUser();

	return (
		<ClerkProvider>
			<html lang='en' suppressHydrationWarning>
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
						<div className='min-h-screen'>
							<Navbar />
							<main className='py-8'>
								<div className='mx-auto max-w-7xl px-4'>
									<div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
										<div className='hidden lg:col-span-3 lg:block'>
											<Sidebar />
										</div>
										<div className='lg:col-span-9'>
											<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
											{children}
										</div>
									</div>
								</div>
							</main>
						</div>
						<Toaster />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
