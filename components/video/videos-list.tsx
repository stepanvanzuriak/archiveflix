import { searchItems, getItemMetadata } from "@/service/archive";

import VideosGrid from "./videos-grid";

const DESIRED_MOVIES_COUNT = 12;

const VideosList = async ({
  currentPage,
  currentSort,
  collection,
  currentSearch,
}: {
  currentPage: string;
  currentSort: string;
  collection?: string;
  currentSearch: string;
}) => {
  const search = await searchItems(
    {
      collection,
      title: currentSearch,
    },
    Number(currentPage),
    {
      sort: currentSort,
      rows: DESIRED_MOVIES_COUNT.toString(),
    },
  );

  const ids = (search.response?.docs || []).map(({ identifier }) => identifier);

  const movies = await Promise.all(ids.map((id) => getItemMetadata(id)));

  return <VideosGrid movies={movies} />;
};

export default VideosList;
