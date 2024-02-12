import { getKratosConfig } from "@/services/kratos";
import { IdentityApi, Identity, Session } from "@ory/kratos-client";
import { GetServerSideProps } from "next";

interface IdentityProps {
  identity: Identity;
  sessions: Session[];
}

export default function IdentityContainer({
  identity,
  sessions,
}: IdentityProps) {
  console.log(identity, "###identity");
  console.log(sessions, "###sessions");
  return <div>hello</div>;
}

export const getServerSideProps: GetServerSideProps<IdentityProps> = async (
  context
) => {
  const kratosConfig = await getKratosConfig();
  const identityApi = new IdentityApi(kratosConfig.adminConfig);
  const result = await identityApi.listIdentitySessions({
    id: context.query.id as string,
  });
  const response = await identityApi.getIdentity({
    id: context.query.id as string,
  });
  const identity = response.data;
  const sessions = result.data;
  console.log(identity, "###identity");
  return {
    props: { identity: identity, sessions: sessions },
  };
};
