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

export interface MessagingProtocolMap {
  'fetch-douban-rating': (data: FetchDoubanRatingRequest) => FrodoSubjectResponse | undefined | Promise<FrodoSubjectResponse | undefined>;
}
