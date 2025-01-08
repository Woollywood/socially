import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const ProfileUserTabsSkeleton: React.FC = () => {
	return (
		<div>
			<div className='flex items-center gap-4'>
				<Skeleton className='w-18 h-6' />
				<Skeleton className='w-18 h-6' />
			</div>
			<div className='space-y-4'>
				{Array.from({ length: 5 }).map((_, index) => (
					<Skeleton key={index} className='aspect-[6] w-full rounded-xl' />
				))}
			</div>
		</div>
	);
};
