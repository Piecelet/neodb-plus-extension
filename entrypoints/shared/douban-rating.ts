export type DoubanRating = {
  count?: number;
  max?: number;
  star_count?: number;
  value?: number;
};

export type FrodoSubjectResponse = {
  id?: string;
  title?: string;
  rating?: DoubanRating;
};

export type FetchDoubanRatingRequest = {
  doubanId: string;
};

export type DoubanRatingService = {
  fetchDoubanRating: (data: FetchDoubanRatingRequest) => Promise<FrodoSubjectResponse | undefined>;
  fetchDoubanDistribution: (data: { url: string }) => Promise<{ distribution?: number[] }>;
};

export { getDoubanRatingService, registerDoubanRatingService } from "./douban-rating.service";
