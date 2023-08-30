import { signIn } from "next-auth/react";
import { BoxFullCenter } from "@/components/layout/BoxFullCenter";

const SignInPage = () => {
	return (
		<BoxFullCenter className="flex gap-4">
			<button className="btn center" onClick={() => signIn("facebook")}>
				login via Facebook
			</button>
			<button className="btn center" onClick={() => signIn("discord")}>
				login via Discord
			</button>
		</BoxFullCenter>
	);
};

export default SignInPage;
