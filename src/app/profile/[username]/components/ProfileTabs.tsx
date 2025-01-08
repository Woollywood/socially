import React from 'react';
import { notFound } from 'next/navigation';
import { FileTextIcon, HeartIcon } from 'lucide-react';
import { getProfileByUsername, getUserLikedPosts, getUserPosts } from '@/actions/profile';
import { PostCard } from '@/components/shared/PostCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
	username: string;
}

export const ProfileTabs: React.FC<Props> = async ({ username }) => {
	const user = await getProfileByUsername(username);

	if (!user) {
		notFound();
	}

	const posts = await getUserPosts(user.id);
	const likedPosts = await getUserLikedPosts(user.id);

	return (
		<Tabs defaultValue='posts' className='w-full'>
			<TabsList className='h-auto w-full justify-start rounded-none border-b bg-transparent p-0'>
				<TabsTrigger
					value='posts'
					className='flex items-center gap-2 rounded-none px-6 font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent'>
					<FileTextIcon className='size-4' />
					Posts
				</TabsTrigger>
				<TabsTrigger
					value='likes'
					className='flex items-center gap-2 rounded-none px-6 font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent'>
					<HeartIcon className='size-4' />
					Likes
				</TabsTrigger>
			</TabsList>

			<TabsContent value='posts' className='mt-6'>
				<div className='space-y-6'>
					{posts.length > 0 ? (
						posts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
					) : (
						<div className='py-8 text-center text-muted-foreground'>No posts yet</div>
					)}
				</div>
			</TabsContent>

			<TabsContent value='likes' className='mt-6'>
				<div className='space-y-6'>
					{likedPosts.length > 0 ? (
						likedPosts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
					) : (
						<div className='py-8 text-center text-muted-foreground'>No liked posts to show</div>
					)}
				</div>
			</TabsContent>
		</Tabs>
	);
};
