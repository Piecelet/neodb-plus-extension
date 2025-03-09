import { doubanPageSearch } from "./douban-page-search";
import { neodbAlbumPageCreate } from "./neodb-album-page-create";
import { neodbPageSearch } from "./neodb-page-search";

export default defineContentScript({
  matches: [
    "*://neodb.social/*",
    "*://music.douban.com/*",
    "*://movie.douban.com/*",
    "*://book.douban.com/*",
  ],
  main() {
    neodbPageSearch();
    doubanPageSearch();
    neodbAlbumPageCreate();
  },
});
