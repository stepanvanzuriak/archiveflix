import VideosList from "./videos-list";

import { getItem, getItems } from "@/service/api";

const Videos = async ({
  currentPage,
  currentSort,
}: {
  currentPage: string;
  currentSort: string;
}) => {
  const data = await getItems(
    {
      collection: "feature_films",
    },
    Number(currentPage),
    {
      sort: currentSort,
    },
  );

  const movies = await Promise.all(
    data.response.docs.map(({ identifier }) => getItem(identifier as string)),
  );

  return <VideosList movies={movies} />;
};

export default Videos;
