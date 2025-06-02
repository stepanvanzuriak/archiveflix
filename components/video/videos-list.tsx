"use client";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

import Loading from "../layout/loading";
import NextPage from "../collection/next-page";

import VideoCard from "./video-card";

import { useUserStore } from "@/stores/user-store-provider";
import { fetcher, getItem, getItems } from "@/service/api";

const DESIRED_MOVIES_COUNT = 12; // Target number of movies to display

const VideosList = ({
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
  const searchParams = useSearchParams();
  const filter = (searchParams.get("filter") as string) || "";
  const router = useRouter();

  const notInterestedList = useUserStore((store) => store.filter);
  const likes = useUserStore((store) => store.likes);
  const watched = useUserStore((store) => store.watched);

  // Calculate how many extra rows we might need based on filter list size
  const estimatedExtraRows = notInterestedList.length;
  const adjustedRows = DESIRED_MOVIES_COUNT + estimatedExtraRows;

  const { data, mutate, isLoading } = useSWR<{
    response: {
      docs: { identifier: string }[];
      numFound: number;
    };
  }>(
    getItems(
      {
        collection,
        title: currentSearch,
      },
      Number(currentPage),
      {
        sort: currentSort,
        rows: adjustedRows.toString(),
      }
    ),
    fetcher
  );

  const filterMovies = useCallback(
    ({ identifier }: { identifier: string }) => {
      const filters = filter.split(",");

      if (filters.includes("watched") && watched.includes(identifier)) {
        return false;
      }

      if (filters.includes("liked") && likes.includes(identifier)) {
        return false;
      }

      if (
        filters.includes("not_interested") &&
        notInterestedList.includes(identifier)
      ) {
        return false;
      }

      return true;
    },
    [filter, likes, notInterestedList, watched]
  );

  const moviesIds = useMemo(() => {
    if (!data?.response.docs) return [];

    const movies = data.response.docs
      .filter(filterMovies)
      .map(({ identifier }) => identifier);

    return movies.slice(0, DESIRED_MOVIES_COUNT);
  }, [data?.response.docs, filterMovies]);

  // Refetch with more rows if needed
  useEffect(() => {
    const shouldFetchMore =
      moviesIds.length < DESIRED_MOVIES_COUNT && data && !currentSearch;

    if (shouldFetchMore) {
      const newRowCount = Math.min(
        adjustedRows + DESIRED_MOVIES_COUNT,
        100 // Cap to prevent too large requests
      );

      // Trigger a new fetch with more rows
      const newUrl = getItems({ collection }, Number(currentPage), {
        sort: currentSort,
        rows: newRowCount.toString(),
      });

      mutate(fetcher(newUrl), { revalidate: false });
    }
  }, [
    moviesIds,
    data,
    adjustedRows,
    collection,
    currentPage,
    currentSort,
    currentSearch,
    mutate,
  ]);

  const openPage = (name: string) => {
    router.push(`/${name}`);
  };

  const {
    data: movies = [],
    isLoading: moviesLoading,
    mutate: mutateItems,
  } = useSWRInfinite<{
    files: { name: string }[];
    metadata: {
      description: string;
      title: string;
      identifier: string;
    };
  }>((index) => getItem(moviesIds[index]), fetcher, {
    initialSize: moviesIds.length,
  });

  const onNotInterested = useCallback(
    (id: string) => {
      mutateItems(movies.filter((item) => item.metadata.identifier !== id));
    },
    [mutateItems, movies]
  );

  const mutations = useCallback(
    async () => {
      await mutateItems([]);
      await mutate({ response: { docs: [], numFound: 0 } });
    },
    // Skipped this as it caused extra renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (currentSearch) {
      mutations();
    }
  }, [currentSearch, mutations]);

  useEffect(() => {
    mutations();
  }, [filter, mutations]);

  if (isLoading || moviesLoading) {
    return <Loading className="h-full" />;
  }

  const filteredMovies = movies.filter((movie) => movie?.metadata?.identifier);

  // Dynamic grid class based on item count
  const getGridClass = (itemCount: number) => {
    if (itemCount === 1) return "grid-cols-1 max-w-sm mx-auto";
    if (itemCount === 2)
      return "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto sm:mx-0";
    if (itemCount === 3)
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto lg:mx-0";

    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3";
  };

  return (
    <>
      {filteredMovies.length > 0 ? (
        <>
          <div
            className={`gap-2 grid ${getGridClass(filteredMovies.length)} flex-grow`}
          >
            {filteredMovies.map((movie) => (
              <VideoCard
                movie={movie}
                onNotInterested={onNotInterested}
                key={movie.metadata.identifier}
                openPage={openPage}
                isNotInterested={notInterestedList.includes(
                  movie.metadata.identifier
                )}
                isLiked={likes.includes(movie.metadata.identifier)}
                isWatched={watched.includes(movie.metadata.identifier)}
              />
            ))}
          </div>
          <NextPage />
        </>
      ) : (
        <div className="flex items-center justify-center flex-grow">
          <h1 className="text-4xl">No results</h1>
        </div>
      )}
    </>
  );
};

export default VideosList;
