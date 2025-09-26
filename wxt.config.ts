import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "NeoDB+ by Piecelet",
    short_name: "NeoDB+",
    permissions: [
      "activeTab",
      "scripting",
      "storage",
      "declarativeNetRequestWithHostAccess",
    ],
    host_permissions: [
      "*",
    ],
    declarative_net_request: {
      rule_resources: [
        {
          id: "frodo_douban_com",
          enabled: true,
          path: "declarative-net-request-rules/frodo_douban_com.json",
        }
      ],
    }
  },
});
