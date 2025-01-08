'use client';

import { useState } from 'react';
import React, { useEffect } from 'react';
import { UploadDropzone } from '@/lib/uploadingthing';
import { XIcon } from 'lucide-react';

interface Props {
	onChange: (url: string) => void;
}

export const ImageUpload: React.FC<Props> = ({ onChange }) => {
	const [imageUrl, setImageUrl] = useState('');
	const hasImage = imageUrl.length > 0;

	useEffect(() => {
		onChange(imageUrl);
	}, [imageUrl]);

	if (hasImage) {
		return (
			<div className='relative size-40'>
				<img src={imageUrl} alt='Upload' className='size-40 rounded-md object-cover' />
				<button
					onClick={() => setImageUrl('')}
					className='absolute right-2 top-2 rounded-full bg-red-500 p-1 shadow-sm'
					type='button'>
					<XIcon className='h-4 w-4 text-white' />
				</button>
			</div>
		);
	}
	return (
		<UploadDropzone
			endpoint='imageUploader'
			onClientUploadComplete={(res) => {
				setImageUrl(res?.[0].url);
			}}
			onUploadError={(error: Error) => {
				console.log(error);
			}}
		/>
	);
};
