import { NextPage } from 'next';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const Page: NextPage = () => {
	return (
		<div>
			<SignedOut>
				<SignInButton mode='modal'>
					<Button>Sign in</Button>
				</SignInButton>
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</div>
	);
};

export default Page;
