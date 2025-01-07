import { NextPage } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { CreatePost } from '@/components/shared/CreatePost';
import { WhoToFollow } from '@/components/shared/WhoToFollow';
import { getPosts } from '@/actions/post';
import { PostCard } from '@/components/shared/PostCard';
import { getDbUserId } from '@/actions/user';

const Page: NextPage = async () => {
	const user = await currentUser();
	const posts = await getPosts();
	const dbUserId = await getDbUserId();

	return (
		<div className='grid grid-cols-1 gap-6 lg:grid-cols-10'>
			<div className='lg:col-span-6'>
				{user && <CreatePost className='mb-6' />}
				<div className='space-y-6'>
					{posts.map((post) => (
						<PostCard key={post.id} post={post} dbUserId={dbUserId} />
					))}
				</div>
			</div>
			<div className='sticky top-20 hidden lg:col-span-4 lg:block'>
				<WhoToFollow />
			</div>
		</div>
	);
};

export default Page;
