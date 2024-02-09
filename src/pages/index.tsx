import Image from "next/image";
import { Inter } from "next/font/google";
import { Configuration, Identity, IdentityApi } from "@ory/kratos-client";
import { getKratosConfig } from "@/services/kratos";
import { GetServerSideProps } from "next";

const inter = Inter({ subsets: ["latin"] });

interface ListProps {
  data: Identity[];
}

export default function Home({ data }: ListProps) {
  console.log(data, "###identities");

  return (
    <div>
      <div>Get identities</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ListProps> = async () => {
  const kratosConfig = await getKratosConfig();
  const identityApi = new IdentityApi(kratosConfig.adminConfig);
  const response = await identityApi.listIdentities();
  const identities = response.data;
  console.log(identities, "###identities");
  return {
    props: { data: identities },
  };
};
