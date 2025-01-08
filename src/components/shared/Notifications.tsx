import { NextPage } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarImage } from '../ui/avatar';
import moment from 'moment';
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from 'lucide-react';
import { getNotifications, markNotificationsAsRead } from '@/actions/notification';

export const Notifications: NextPage = async () => {
	const notifications = await getNotifications();
	await markNotificationsAsRead(notifications.map((notification) => notification.id));

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'LIKE':
				return <HeartIcon className='size-4 text-red-500' />;
			case 'COMMENT':
				return <MessageCircleIcon className='size-4 text-blue-500' />;
			case 'FOLLOW':
				return <UserPlusIcon className='size-4 text-green-500' />;
			default:
				return null;
		}
	};

	return (
		<div className='space-y-4'>
			<Card>
				<CardHeader className='border-b'>
					<div className='flex items-center justify-between'>
						<CardTitle>Notifications</CardTitle>
						<span className='text-sm text-muted-foreground'>
							{notifications.filter((n) => !n.read).length} unread
						</span>
					</div>
				</CardHeader>
				<CardContent className='p-0'>
					<ScrollArea className='h-[calc(100vh-12rem)]'>
						{notifications.length === 0 ? (
							<div className='p-4 text-center text-muted-foreground'>No notifications yet</div>
						) : (
							notifications.map((notification) => (
								<div
									key={notification.id}
									className={`flex items-start gap-4 border-b p-4 transition-colors hover:bg-muted/25 ${
										!notification.read ? 'bg-muted/50' : ''
									}`}>
									<Avatar className='mt-1'>
										<AvatarImage src={notification.creator.image ?? '/avatar.png'} />
									</Avatar>
									<div className='flex-1 space-y-1'>
										<div className='flex items-center gap-2'>
											{getNotificationIcon(notification.type)}
											<span>
												<span className='font-medium'>
													{notification.creator.name ?? notification.creator.username}
												</span>{' '}
												{notification.type === 'FOLLOW'
													? 'started following you'
													: notification.type === 'LIKE'
														? 'liked your post'
														: 'commented on your post'}
											</span>
										</div>

										{notification.post &&
											(notification.type === 'LIKE' || notification.type === 'COMMENT') && (
												<div className='space-y-2 pl-6'>
													<div className='mt-2 rounded-md bg-muted/30 p-2 text-sm text-muted-foreground'>
														<p>{notification.post.content}</p>
														{notification.post.image && (
															<img
																src={notification.post.image}
																alt='Post content'
																className='mt-2 h-auto w-full max-w-[200px] rounded-md object-cover'
															/>
														)}
													</div>

													{notification.type === 'COMMENT' && notification.comment && (
														<div className='rounded-md bg-accent/50 p-2 text-sm'>
															{notification.comment.content}
														</div>
													)}
												</div>
											)}

										<p className='pl-6 text-sm text-muted-foreground'>
											{moment(notification.createdAt).fromNow()}
										</p>
									</div>
								</div>
							))
						)}
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
};
