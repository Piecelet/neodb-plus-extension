import { addFromNeoDB } from "./add-from-neodb";
import { registerDoubanRatingHandler } from "./douban-rating";
import { registerNetworkHeaderSpoofing } from "./network-headers";

export default defineBackground(() => {
  addFromNeoDB();
  registerNetworkHeaderSpoofing();
  registerDoubanRatingHandler();
});
