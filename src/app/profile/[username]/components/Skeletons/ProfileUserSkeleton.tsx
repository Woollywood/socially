import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const ProfileUserSkeleton: React.FC = () => {
	return (
		<div className='mx-auto w-full max-w-lg'>
			<Card className='bg-card'>
				<CardContent className='pt-6'>
					<div className='flex flex-col items-center text-center'>
						<Skeleton className='h-24 w-24 rounded-full' />
						<Skeleton className='mt-4 h-8 w-1/3 text-2xl font-bold' />
						<Skeleton className='mt-2 h-4 w-1/6 text-muted-foreground' />
						<Skeleton className='mt-2 h-6 w-1/4 text-sm' />

						<div className='mt-6 w-full'>
							<div className='mb-4 grid grid-cols-3 gap-12'>
								<div className='flex w-full items-center justify-center'>
									<Skeleton className='h-12 w-full' />
								</div>
								<div className='flex w-full items-center justify-center'>
									<Skeleton className='h-12 w-full' />
								</div>
								<div className='flex w-full items-center justify-center'>
									<Skeleton className='h-12 w-full' />
								</div>
							</div>
						</div>

						<Skeleton className='w-full' />

						<div className='mt-6 w-full space-y-2 text-sm'>
							<Skeleton className='h-2 w-1/6' />
							<Skeleton className='h-2 w-1/4' />
							<Skeleton className='h-2 w-1/3' />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
