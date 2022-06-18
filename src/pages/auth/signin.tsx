import { getProviders, signIn } from "next-auth/react";
import type { InferGetServerSidePropsType } from "next";

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};

const SignInPage = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(providers);
  return (
    <div className="flex justify-center p-16">
      <button
        className="btn center"
        onClick={() => signIn(providers?.facebook?.id)}
      >
        sign in fb
      </button>
    </div>
  );
};

export default SignInPage;
