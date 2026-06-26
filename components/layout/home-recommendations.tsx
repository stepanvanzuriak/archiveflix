import { searchItems, getItemMetadata, MovieData } from "@/service/archive";

import RecommendationsView, {
  CategoryData,
} from "./recommendations-view";

interface RecommendationCategory {
  name: string;
  collection?: string;
  title?: string;
  sort?: string;
}

const MOVIES_PER_CATEGORY = 4;
// Over-fetch a small buffer so enough movies remain after client-side exclusion.
const FETCH_ROWS = MOVIES_PER_CATEGORY * 2;

const CATEGORIES: RecommendationCategory[] = [
  {
    name: "Popular Classic Films",
    collection: "feature_films",
    sort: "month desc",
  },
  {
    name: "Educational Content",
    collection: "prelinger",
    sort: "num_reviews desc",
  },
  {
    name: "Animation Collection",
    collection: "animationandcartoons",
    sort: "downloads desc",
  },
];

const fetchCategory = async (
  category: RecommendationCategory,
): Promise<CategoryData> => {
  const search = await searchItems(
    {
      collection: category.collection,
      title: category.title,
    },
    1,
    {
      sort: category.sort || "downloads desc",
      rows: FETCH_ROWS.toString(),
    },
  );

  const ids = (search.response?.docs || []).map(
    ({ identifier }) => identifier,
  );

  const movies: MovieData[] = await Promise.all(
    ids.map((id) => getItemMetadata(id)),
  );

  return {
    name: category.name,
    movies,
    hasMore:
      (search.response?.numFound || 0) > (search.response?.docs?.length || 0),
  };
};

const HomeRecommendations = async () => {
  const categories = await Promise.all(CATEGORIES.map(fetchCategory));

  return (
    <RecommendationsView
      categories={categories}
      moviesPerCategory={MOVIES_PER_CATEGORY}
    />
  );
};

export default HomeRecommendations;
