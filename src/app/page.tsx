import { NextPage } from 'next';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const Page: NextPage = () => {
	return (
		<div>
			<SignedOut>
				<SignInButton mode='modal' />
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</div>
	);
};

export default Page;
