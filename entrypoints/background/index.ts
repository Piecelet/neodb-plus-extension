import { addFromNeoDB } from "./add-from-neodb";
import { registerDoubanRatingHandler } from "./douban-rating";

export default defineBackground(() => {
  addFromNeoDB();
  registerDoubanRatingHandler();
});
