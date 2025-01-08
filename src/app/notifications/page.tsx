import { Notifications } from '@/components/shared/Notifications';
import { NotificationSkeleton } from '@/components/shared/NotificationSkeleton';
import { NextPage } from 'next';
import { Suspense } from 'react';

const Page: NextPage = () => {
	return (
		<Suspense fallback={<NotificationSkeleton />}>
			<Notifications />
		</Suspense>
	);
};

export default Page;
