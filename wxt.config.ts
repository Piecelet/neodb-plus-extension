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
      "webNavigation",
      "webRequest",
      "webRequestBlocking",
      "declarativeNetRequest",
      "declarativeNetRequestWithHostAccess",
    ],
    host_permissions: [
      "*",
    ],
  },
});
