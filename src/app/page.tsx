import { NextPage } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { CreatePost } from '@/components/shared/CreatePost';
import { WhoToFollow } from '@/components/shared/WhoToFollow';

const Page: NextPage = async () => {
	const user = await currentUser();

	return (
		<div className='grid grid-cols-1 gap-6 lg:grid-cols-10'>
			<div className='lg:col-span-6'>{user && <CreatePost className='mb-6' />}</div>
			<div className='sticky top-20 hidden lg:col-span-4 lg:block'>
				<WhoToFollow />
			</div>
		</div>
	);
};

export default Page;
