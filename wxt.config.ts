import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "NeoDB Plus (Neo2DB)",
    short_name: "NeoDB+",
    permissions: ["activeTab", "scripting", "storage", "webNavigation"],
    host_permissions: [
      "https://neodb.social/*",
      "https://music.douban.com/*",
      "https://movie.douban.com/*",
      "https://book.douban.com/*",
    ],
  },
});
