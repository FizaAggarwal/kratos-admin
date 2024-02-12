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
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="text-2xl font-bold py-5 px-8">View Identity</div>
      <div className="flex gap-8">
        <div className="bg-gray-800 p-5 mx-5 rounded-lg w-[50%]">
          <pre className="text-white">{JSON.stringify(identity, null, 2)}</pre>
        </div>
        <div>
          <div className="mb-4">
            <h3 className="font-bold">id</h3>
            <div className="mt-2 text-sm">{identity.id}</div>
          </div>
          <hr className="border-gray-600" />

          <div className="my-4">
            <h3 className="font-bold">traits</h3>
            <div className="mt-2 text-sm">
              {JSON.stringify(identity.traits)}
            </div>
          </div>
          <hr className="border-gray-600" />

          <div className="my-4">
            <h3 className="font-bold">state</h3>
            <div className="mt-2 text-sm">{identity.state}</div>
          </div>
          <hr className="border-gray-600" />

          <div className="my-4">
            <h3 className="font-bold">created_at</h3>
            <div className="mt-2 text-sm">{identity.created_at}</div>
          </div>
          <hr className="border-gray-600" />

          <div className="my-4">
            <h3 className="font-bold">updated_at</h3>
            <div className="mt-2 text-sm">{identity.updated_at}</div>
          </div>
          <hr className="border-gray-600" />

          <div className="my-4">
            <h3 className="font-bold">verifiable_addresses</h3>
            <div className="mt-2 text-sm">
              {identity.verifiable_addresses
                ? identity.verifiable_addresses.map((address) => (
                    <div key={address.id}>
                      {address.value}
                      {}
                    </div>
                  ))
                : "No verifiable addresses"}
            </div>
          </div>
          <hr className="border-gray-600" />

          <div className="my-4">
            <h3 className="font-bold">recovery_addresses</h3>
            <div className="mt-2 text-sm">
              {identity.recovery_addresses
                ? identity.recovery_addresses.map((address) => (
                    <div key={address.id}>{address.value}</div>
                  ))
                : "No recovery addresses"}
            </div>
          </div>
          <hr className="border-gray-600" />
        </div>
      </div>

      <div className="text-2xl font-bold py-5 px-8 mt-16">Sessions</div>
      <table className="table-auto text-left whitespace-no-wrap mt-4 w-full">
        <thead>
          <tr className="text-sm font-medium text-white uppercase bg-gray-800">
            <th className="px-8 py-5">Index</th>
            <th className="px-8 py-5">Active</th>
            <th className="px-8 py-5">Authentication Method</th>
            <th className="px-8 py-5">Assurance Level</th>
            <th className="px-8 py-5">Devices</th>
            <th className="px-8 py-5">Authenticated at</th>
            <th className="px-8 py-5">Expires at</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={identity.id} className="text-white bg-gray-700">
              <td className="px-8 py-5">{index + 1}</td>
              <td className="px-8 py-5">{JSON.stringify(session.active)}</td>
              <td className="px-8 py-5">
                {session.authentication_methods
                  ? session.authentication_methods[0].method
                  : ""}
              </td>
              <td className="px-8 py-5">
                {session.authenticator_assurance_level}
              </td>
              <td className="px-8 py-5">
                {session.devices ? session.devices[0].ip_address : ""}
              </td>
              <td className="px-8 py-5">{session.authenticated_at}</td>
              <td className="px-8 py-5">{session.expires_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
