'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftIcon, HomeIcon } from 'lucide-react';

const NotFound: React.FC = () => {
	const { username } = useParams<{ username: string }>();

	return (
		<div className='grid min-h-[80vh] place-items-center px-4'>
			<Card className='w-full max-w-md'>
				<CardContent className='pt-6'>
					<div className='space-y-6 text-center'>
						<p className='font-mono text-8xl font-bold text-primary'>404</p>

						<div className='space-y-2'>
							<h1 className='text-2xl font-bold tracking-tight'>{username} not found</h1>
							<p className='text-muted-foreground'>
								The user you&apos;re looking for doesn&apos;t exist.
							</p>
						</div>

						<div className='flex flex-col justify-center gap-3 sm:flex-row'>
							<Button variant='default' asChild>
								<Link href='/'>
									<HomeIcon className='mr-2 size-4' />
									Back to Home
								</Link>
							</Button>

							<Button variant='outline' asChild>
								<Link href='/'>
									<ArrowLeftIcon className='mr-2 size-4' />
									Home
								</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default NotFound;
