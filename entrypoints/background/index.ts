import { registerDoubanRatingHandler } from "./douban-rating";

export default defineBackground(() => {
  registerDoubanRatingHandler();
});
