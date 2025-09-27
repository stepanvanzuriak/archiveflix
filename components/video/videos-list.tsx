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

const DESIRED_MOVIES_COUNT = 12;

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

  // Build exclude list based on current filters
  const excludeIds = useMemo(() => {
    const filters = filter.split(",");
    const toExclude: string[] = [];

    if (filters.includes("watched")) {
      toExclude.push(...watched);
    }
    if (filters.includes("liked")) {
      toExclude.push(...likes);
    }
    if (filters.includes("not_interested")) {
      toExclude.push(...notInterestedList);
    }

    return toExclude;
  }, [filter, watched, likes, notInterestedList]);

  const { data, mutate, isLoading } = useSWR<{
    response: {
      docs: { identifier: string }[];
      numFound: number;
      afterRevalidation?: boolean;
    };
  }>(
    getItems(
      {
        collection,
        title: currentSearch,
        excludeIds,
      },
      Number(currentPage),
      {
        sort: currentSort,
        rows: DESIRED_MOVIES_COUNT.toString(),
      },
    ),
    fetcher,
  );

  const moviesIds = useMemo(() => {
    if (!data?.response.docs) return [];

    return data.response.docs.map(({ identifier }) => identifier);
  }, [data?.response.docs]);

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
      afterRevalidation?: boolean;
    };
  }>((index) => getItem(moviesIds[index]), fetcher, {
    initialSize: moviesIds.length,
  });

  const onNotInterested = useCallback(
    (id: string) => {
      mutateItems(movies.filter((item) => item.metadata.identifier !== id));
    },
    [mutateItems, movies],
  );

  const mutations = useCallback(
    () => {
      mutate({ response: { docs: [], numFound: 0, afterRevalidation: true } });
      mutateItems([
        {
          files: [],
          metadata: {
            title: "",
            description: "",
            identifier: "",
            afterRevalidation: true,
          },
        },
      ]);
    },
    // Skipped this as it caused extra renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (currentSearch) {
      mutations();
    }
  }, [currentSearch, mutations]);

  useEffect(() => {
    mutations();
  }, [filter, mutations]);

  const filteredMovies = movies.filter((movie) => movie?.metadata?.identifier);

  if (
    isLoading ||
    moviesLoading ||
    data?.response.afterRevalidation ||
    filteredMovies[0]?.metadata?.afterRevalidation
  ) {
    return <Loading className="h-full" />;
  }

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
                  movie.metadata.identifier,
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
