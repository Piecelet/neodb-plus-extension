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

