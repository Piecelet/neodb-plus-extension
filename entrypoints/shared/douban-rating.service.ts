import { defineProxyService } from "@webext-core/proxy-service";

import type { DoubanRatingService } from "./douban-rating";

export const [registerDoubanRatingService, getDoubanRatingService] = defineProxyService(
  "douban-rating",
  (service: DoubanRatingService) => service,
);
