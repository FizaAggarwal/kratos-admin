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
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="text-2xl font-bold py-5 px-8">Get identities</div>
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr className="text-sm font-medium text-white uppercase bg-gray-800">
            <th className="px-8 py-5">First Name</th>
            <th className="px-8 py-5">Last Name</th>
            <th className="px-8 py-5">Email</th>
            <th className="px-8 py-5">ID</th>
          </tr>
        </thead>
        <tbody>
          {data.map((identity) => (
            <tr key={identity.id} className="text-white bg-gray-700">
              <td className="px-8 py-5">{identity.traits.name.first || "-"}</td>
              <td className="px-8 py-5">{identity.traits.name.last || "-"}</td>
              <td className="px-8 py-5">{identity.traits.email}</td>
              <td className="px-8 py-5">{identity.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
