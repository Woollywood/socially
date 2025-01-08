'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EditIcon } from 'lucide-react';
import { getProfileByUsername, updateUserProfile } from '@/actions/profile';
import toast from 'react-hot-toast';
import { ErrorMessage } from '@/components/ui/form/ErrorMessage';

interface Props {
	user: NonNullable<Awaited<ReturnType<typeof getProfileByUsername>>>;
}

export const ProfileUserDialog: React.FC<Props> = ({ user }) => {
	const [isShow, setIsShow] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [state, setState] = useState<Awaited<ReturnType<typeof updateUserProfile>> | null>(null);

	const [editForm, setEditForm] = useState({
		name: user.name || '',
		bio: user.bio || '',
		location: user.location || '',
		website: user.website || '',
	});

	const handleSubmit = () => {
		startTransition(async () => {
			const formData = new FormData();
			Object.entries(editForm).forEach(([key, value]) => {
				formData.append(key, value);
			});

			const result = await updateUserProfile(formData);
			setState(result);
			if (result?.response) {
				const { status, message } = result.response;
				if (status === 200) {
					setIsShow(false);
					toast.success('Profile updated successfully');
				} else {
					toast.error(message);
				}
			}
		});
	};

	return (
		<>
			<Button className='mt-4 w-full' onClick={() => setIsShow(true)}>
				<EditIcon className='mr-2 size-4' />
				Edit Profile
			</Button>
			<Dialog open={isShow} onOpenChange={setIsShow}>
				<DialogContent className='sm:max-w-[500px]'>
					<DialogHeader>
						<DialogTitle>Edit Profile</DialogTitle>
					</DialogHeader>
					<div className='space-y-4 py-4'>
						<div className='space-y-2'>
							<Label>Name</Label>
							<Input
								name='name'
								value={editForm.name}
								onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
								placeholder='Your name'
							/>
							<ErrorMessage errors={state?.errors?.name} />
						</div>
						<div className='space-y-2'>
							<Label>Bio</Label>
							<Textarea
								name='bio'
								value={editForm.bio}
								onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
								className='min-h-[100px]'
								placeholder='Tell us about yourself'
							/>
							<ErrorMessage errors={state?.errors?.bio} />
						</div>
						<div className='space-y-2'>
							<Label>Location</Label>
							<Input
								name='location'
								value={editForm.location}
								onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
								placeholder='Where are you based?'
							/>
							<ErrorMessage errors={state?.errors?.location} />
						</div>
						<div className='space-y-2'>
							<Label>Website</Label>
							<Input
								name='website'
								value={editForm.website}
								onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
								placeholder='Your personal website'
							/>
							<ErrorMessage errors={state?.errors?.website} />
						</div>
					</div>
					<div className='flex justify-end gap-3'>
						<DialogClose asChild>
							<Button variant='outline'>Cancel</Button>
						</DialogClose>
						<Button onClick={handleSubmit} disabled={isPending}>
							Save Changes
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
