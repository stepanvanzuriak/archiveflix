"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useUserStore } from "@/stores/user-store-provider";
import type { MovieData } from "@/service/archive";

import NextPage from "../collection/next-page";

import VideoCard from "./video-card";

// Dynamic grid class based on item count
const getGridClass = (itemCount: number) => {
  if (itemCount === 1) return "grid-cols-1 max-w-sm mx-auto";
  if (itemCount === 2)
    return "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto sm:mx-0";
  if (itemCount === 3)
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto lg:mx-0";

  return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3";
};

const VideosGrid = ({ movies }: { movies: MovieData[] }) => {
  const searchParams = useSearchParams();
  const filter = (searchParams.get("filter") as string) || "not_interested";
  const router = useRouter();

  const notInterestedList = useUserStore((store) => store.filter);
  const likes = useUserStore((store) => store.likes);
  const watched = useUserStore((store) => store.watched);

  const [removedIds, setRemovedIds] = useState<string[]>([]);

  // Build exclude list based on the active filters
  const excludeIds = useMemo(() => {
    const filters = filter.split(",");
    const toExclude: string[] = [];

    if (filters.includes("watched")) toExclude.push(...watched);
    if (filters.includes("liked")) toExclude.push(...likes);
    if (filters.includes("not_interested")) toExclude.push(...notInterestedList);

    return new Set(toExclude);
  }, [filter, watched, likes, notInterestedList]);

  const openPage = (name: string) => {
    router.push(`/${name}`);
  };

  const onNotInterested = useCallback((id: string) => {
    setRemovedIds((prev) => [...prev, id]);
  }, []);

  const filteredMovies = useMemo(
    () =>
      movies.filter(
        (movie) =>
          movie?.metadata?.identifier &&
          !excludeIds.has(movie.metadata.identifier) &&
          !removedIds.includes(movie.metadata.identifier),
      ),
    [movies, excludeIds, removedIds],
  );

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

export default VideosGrid;
