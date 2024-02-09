import { Configuration } from "@ory/kratos-client";

interface KratosConfig {
  adminConfig: Configuration;
  publicConfig: Configuration;
}

interface JSONConfig {
  kratosAdminURL?: string;
  kratosPublicURL?: string;
  reverseProxy?: boolean;
}

const urlConfig = {
  kratosAdminURL: "http://localhost:4434",
  kratosPublicURL: "http://localhost:4433",
  reverseProxy: false,
};

let JSON_CONFIG: JSONConfig = {};

async function loadConfig() {
  if (!JSON_CONFIG.kratosAdminURL) {
    JSON_CONFIG = urlConfig as JSONConfig;
    if (JSON_CONFIG.reverseProxy) {
      // every admin-url starts with /admin, so there is no need to have /admin/admin. There is a url rewrite in the nginx config
      JSON_CONFIG.kratosAdminURL = "/admin";
      JSON_CONFIG.kratosPublicURL = "/";
    }
  }
  return JSON_CONFIG;
}

export async function getKratosConfig() {
  const configJSON = await loadConfig();
  return {
    adminConfig: new Configuration({
      basePath: configJSON.kratosAdminURL,
      baseOptions: { withCredentials: true },
    }),
    publicConfig: new Configuration({
      basePath: configJSON.kratosPublicURL,
      baseOptions: { withCredentials: true },
    }),
  } as KratosConfig;
}
