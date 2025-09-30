import { doubanPageSearch } from "./douban-page-search";
import { neodbDoubanRating } from "./douban-rating";
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
    neodbDoubanRating();
  },
});
