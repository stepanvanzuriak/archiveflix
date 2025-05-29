"use client";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

import MovieCard from "./movie-card";
import Loading from "./loading";

import { useUserStore } from "@/stores/user-store-provider";
import { fetcher, getItem, getItems } from "@/service/api";

const DESIRED_MOVIES_COUNT = 12; // Target number of movies to display

const Videos = ({
  currentPage,
  currentSort,
  collection,
}: {
  currentPage: string;
  currentSort: string;
  collection: string;
}) => {
  const router = useRouter();
  const notInterested = useUserStore((store) => store.addToFilter);
  const notInterstedList = useUserStore((store) => store.filter);

  // Calculate how many extra rows we might need based on filter list size
  const estimatedExtraRows = notInterstedList.length;
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
      },
      Number(currentPage),
      {
        sort: currentSort,
        rows: adjustedRows.toString(),
      },
    ),
    fetcher,
  );

  const moviesIds = useMemo(() => {
    if (!data?.response.docs) return [];

    return data.response.docs
      .filter(({ identifier }) => !notInterstedList.includes(identifier))
      .map(({ identifier }) => identifier)
      .slice(0, DESIRED_MOVIES_COUNT); // Ensure we don't show more than desired
  }, [data, notInterstedList]);

  // Check if we need to fetch more data
  const needsMoreData = useMemo(() => {
    if (!data?.response.docs) return false;

    const filteredCount = data.response.docs.filter(
      ({ identifier }) => !notInterstedList.includes(identifier),
    ).length;

    return (
      filteredCount < DESIRED_MOVIES_COUNT &&
      data.response.docs.length < data.response.numFound
    );
  }, [data, notInterstedList]);

  // Refetch with more rows if needed
  useEffect(() => {
    if (needsMoreData && data) {
      const newRowCount = Math.min(
        adjustedRows + DESIRED_MOVIES_COUNT,
        100, // Cap to prevent too large requests
      );

      // Trigger a new fetch with more rows
      const newUrl = getItems({ collection }, Number(currentPage), {
        sort: currentSort,
        rows: newRowCount.toString(),
      });

      mutate(fetcher(newUrl), { revalidate: false });
    }
  }, [
    needsMoreData,
    data,
    adjustedRows,
    collection,
    currentPage,
    currentSort,
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

  const handleDropDown = useCallback(
    async (key: string, id: string) => {
      if (key === "not_interested") {
        notInterested(id);
        await mutateItems(
          movies.filter((item) => item.metadata.identifier !== id),
        );
      }
    },
    [moviesIds],
  );

  if (isLoading || moviesLoading) {
    return <Loading className="h-full" />;
  }

  return (
    <div className="gap-2 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 flex-grow">
      {movies.map((movie) => (
        <MovieCard
          movie={movie}
          handleDropDown={handleDropDown}
          key={movie.metadata.identifier}
          openPage={openPage}
        />
      ))}
    </div>
  );
};

export default Videos;
