import React from 'react';

interface Props {
	errors?: string[];
}

export const ErrorMessage: React.FC<Props> = ({ errors = [] }) => {
	const hasErrors = errors.length > 0;

	return (
		hasErrors && (
			<ul className='space-y-0.5 py-0.5'>
				{errors.map((error, index) => (
					<li key={index} className='text-[0.75rem] font-medium text-red-600'>
						{error}
					</li>
				))}
			</ul>
		)
	);
};
