import { getProviders, signIn } from "next-auth/react";
import type { InferGetServerSidePropsType } from "next";
import { BoxFullCenter } from "@/components/layout/BoxFullCenter";

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
  return (
    <BoxFullCenter>
      <button
        className="btn center"
        onClick={() => signIn(providers?.facebook?.id)}
      >
        login via FB
      </button>
    </BoxFullCenter>
  );
};

export default SignInPage;
