import { getProfileByUsername } from '@/actions/profile';
import { Metadata, NextPage } from 'next';
import { notFound } from 'next/navigation';
import { ProfileTabs } from './components/ProfileTabs';
import { ProfileUser } from './components/ProfileUser';
import { Suspense } from 'react';
import { ProfileUserSkeleton } from './components/Skeletons/ProfileUserSkeleton';
import { ProfileUserTabsSkeleton } from './components/Skeletons/ProfileUserTabsSkeleton';

interface Props {
	params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username } = await params;
	const user = await getProfileByUsername(username);
	if (!user) {
		return {};
	}

	return { title: `${user.name ?? user.username}`, description: user.bio || `Check out ${user.username}'s profile` };
}

const Page: NextPage<Props> = async ({ params }) => {
	const { username } = await params;
	const user = await getProfileByUsername(username);

	if (!user) {
		notFound();
	}

	return (
		<div className='mx-auto max-w-3xl'>
			<div className='grid grid-cols-1 gap-6'>
				<Suspense fallback={<ProfileUserSkeleton />}>
					<ProfileUser username={username} />
				</Suspense>
				<Suspense fallback={<ProfileUserTabsSkeleton />}>
					<ProfileTabs username={username} />
				</Suspense>
			</div>
		</div>
	);
};

export default Page;
