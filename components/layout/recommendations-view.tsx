"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { sampleSize } from "lodash";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useUserStore } from "@/stores/user-store-provider";
import { COMMON_WORDS } from "@/constants";
import { fetcher, getItem } from "@/service/api";
import { cleanHTML, processArrayOrString, pickBestThumbnail } from "@/utils";
import type { MovieData } from "@/service/archive";

import VideoCard from "../video/video-card";

export interface CategoryData {
  name: string;
  movies: MovieData[];
  hasMore: boolean;
}

interface UserPreferences {
  creators: Set<string>;
  subjects: Set<string>;
  genres: Set<string>;
  languages: Set<string>;
  years: Set<number>;
  keywords: Set<string>;
}

const extractKeywords = (text: string): string[] => {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3 && !COMMON_WORDS.has(word))
    .map((word) => word.replace(/[^\w]/g, ""));
};

const extractUserPreferences = (likedMovies: MovieData[]): UserPreferences => {
  const validLikedMovies = likedMovies.filter(
    (movie) => movie?.metadata?.identifier,
  );

  const preferences: UserPreferences = {
    creators: new Set(),
    subjects: new Set(),
    genres: new Set(),
    languages: new Set(),
    years: new Set(),
    keywords: new Set(),
  };

  if (validLikedMovies.length === 0) {
    return preferences;
  }

  validLikedMovies.forEach((movie) => {
    const { metadata } = movie;

    if (metadata.creator) {
      preferences.creators.add(metadata.creator.toLowerCase());
    }

    processArrayOrString(metadata.subject, (subject) => {
      preferences.subjects.add(subject.toLowerCase());
    });

    if (metadata.genre && Array.isArray(metadata.genre)) {
      metadata.genre.forEach((genre) =>
        preferences.genres.add(genre.toLowerCase()),
      );
    }

    processArrayOrString(metadata.language, (lang) => {
      preferences.languages.add(lang.toLowerCase());
    });

    if (metadata.date) {
      const year = parseInt(metadata.date.substring(0, 4));

      if (!isNaN(year)) preferences.years.add(year);
    }

    const titleWords = extractKeywords(metadata.title);
    const descWords = extractKeywords(metadata.description || "");

    [...titleWords, ...descWords].forEach((word) => {
      if (word) preferences.keywords.add(word);
    });
  });

  return preferences;
};

const calculateMovieScore = (
  movie: MovieData,
  userPreferences: UserPreferences,
  likes: string[],
): number => {
  let score = 0;
  const metadata = movie.metadata;

  if (likes.includes(metadata.identifier)) {
    score += 100;
  }

  if (metadata.creator) {
    const movieCreator = metadata.creator.toLowerCase();

    userPreferences.creators.forEach((likedCreator) => {
      if (
        movieCreator.includes(likedCreator) ||
        likedCreator.includes(movieCreator)
      ) {
        score += 80;
      }
    });
  }

  processArrayOrString(metadata.subject, (subject) => {
    if (userPreferences.subjects.has(subject.toLowerCase())) {
      score += 60;
    }
  });

  if (metadata.genre && Array.isArray(metadata.genre)) {
    metadata.genre.forEach((genre) => {
      if (userPreferences.genres.has(genre.toLowerCase())) {
        score += 50;
      }
    });
  }

  processArrayOrString(metadata.language, (lang) => {
    if (userPreferences.languages.has(lang.toLowerCase())) {
      score += 30;
    }
  });

  if (metadata.date) {
    const movieYear = parseInt(metadata.date.substring(0, 4));

    if (!isNaN(movieYear)) {
      userPreferences.years.forEach((likedYear) => {
        const yearDiff = Math.abs(movieYear - likedYear);

        if (yearDiff <= 5) score += 25;
        else if (yearDiff <= 10) score += 15;
        else if (yearDiff <= 20) score += 5;
      });
    }
  }

  const titleWords = extractKeywords(metadata.title);
  const descWords = extractKeywords(metadata.description || "");

  [...titleWords, ...descWords].forEach((word) => {
    if (userPreferences.keywords.has(word)) {
      score += 10;
    }
  });

  return score;
};

const sortMoviesByScore = (
  movies: MovieData[],
  userPreferences: UserPreferences,
  likes: string[],
): MovieData[] => {
  return [...movies]
    .map((movie) => ({
      movie,
      score: calculateMovieScore(movie, userPreferences, likes),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ movie }) => movie);
};

const findFeaturedMovie = (
  allMovies: MovieData[],
  userPreferences: UserPreferences,
  likes: string[],
): MovieData | null => {
  if (allMovies.length === 0) return null;

  const scoredMovies = allMovies
    .map((movie) => ({
      movie,
      score: calculateMovieScore(movie, userPreferences, likes),
    }))
    .sort((a, b) => b.score - a.score);

  if (scoredMovies[0].score > 0) {
    return scoredMovies[0].movie;
  }

  return null;
};

const CategoryRow: React.FC<{
  title: string;
  movies: MovieData[];
  userPreferences: UserPreferences;
  likes: string[];
  openPage: (name: string) => void;
  onNotInterested: (id: string) => void;
}> = ({ title, movies, userPreferences, likes, openPage, onNotInterested }) => {
  const sortedMovies = useMemo(() => {
    return sortMoviesByScore(movies, userPreferences, likes);
  }, [movies, userPreferences, likes]);

  if (movies.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
            {sortedMovies.map((movie) => (
              <VideoCard
                isLiked={false}
                isWatched={false}
                isNotInterested={false}
                key={movie.metadata.identifier}
                onNotInterested={onNotInterested}
                movie={movie}
                openPage={openPage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendationsView: React.FC<{
  categories: CategoryData[];
  moviesPerCategory: number;
}> = ({ categories, moviesPerCategory }) => {
  const router = useRouter();

  const likes = useUserStore((store) => store.likes);
  const filter = useUserStore((store) => store.filter);
  const watched = useUserStore((store) => store.watched);

  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [likedMovies, setLikedMovies] = useState<MovieData[]>([]);

  const randomLikes = useMemo(() => {
    return sampleSize(likes, Math.min(30, likes.length));
  }, [likes]);

  // Fetch metadata for liked movies to build the user's preference profile.
  useEffect(() => {
    if (randomLikes.length === 0) {
      setLikedMovies([]);

      return;
    }

    let cancelled = false;

    Promise.all(randomLikes.map((id) => fetcher(getItem(id))))
      .then((results: MovieData[]) => {
        if (!cancelled) {
          setLikedMovies(
            results.filter((movie) => movie?.metadata?.identifier),
          );
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [randomLikes]);

  const userPreferences = useMemo(() => {
    return extractUserPreferences(likedMovies);
  }, [likedMovies]);

  const excludeIds = useMemo(() => {
    return new Set([...filter, ...likes, ...watched, ...removedIds]);
  }, [filter, likes, watched, removedIds]);

  const visibleCategories = useMemo(() => {
    return categories.map((category) => ({
      name: category.name,
      movies: category.movies
        .filter(
          (movie) =>
            movie?.metadata?.identifier &&
            !excludeIds.has(movie.metadata.identifier),
        )
        .slice(0, moviesPerCategory),
    }));
  }, [categories, excludeIds, moviesPerCategory]);

  const openPage = useCallback(
    (name: string) => {
      router.push(`/${name}`);
    },
    [router],
  );

  const onNotInterested = useCallback((id: string) => {
    setRemovedIds((prev) => [...prev, id]);
  }, []);

  const featuredMovie = useMemo(() => {
    const allMovies = visibleCategories.flatMap((category) => category.movies);

    return findFeaturedMovie(allMovies, userPreferences, likes);
  }, [visibleCategories, userPreferences, likes]);

  const thumbnailName = featuredMovie
    ? pickBestThumbnail(featuredMovie.files)
    : null;

  return (
    <div className="flex-grow w-full">
      {featuredMovie && (
        <div className="relative h-96 mb-8 overflow-hidden rounded-md">
          {thumbnailName && (
            <div className="absolute inset-0">
              <Image
                fill
                priority
                alt={featuredMovie.metadata.title}
                className="object-cover object-center grayscale blur-sm"
                sizes="100vw"
                src={`https://archive.org/download/${featuredMovie.metadata.identifier}/${thumbnailName}`}
                unoptimized
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

          <div className="relative z-20 h-full flex items-center">
            <div className="flex items-center gap-8 px-12 w-full">
              {thumbnailName && (
                <div className="flex-shrink-0 hidden sm:block">
                  <div className="relative w-48 h-72 rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      fill
                      priority
                      alt={featuredMovie.metadata.title}
                      className="object-cover rounded-md"
                      sizes="192px"
                      src={`https://archive.org/download/${featuredMovie.metadata.identifier}/${thumbnailName}`}
                      unoptimized
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 max-w-2xl">
                <h3 className="text-white text-4xl font-bold mb-4 leading-tight">
                  {featuredMovie.metadata.title}
                </h3>

                <div className="flex items-center gap-4 mb-4 text-gray-300">
                  {featuredMovie.metadata.date && (
                    <span className="text-sm">
                      {new Date(featuredMovie.metadata.date).getFullYear()}
                    </span>
                  )}
                  {featuredMovie.metadata.creator && (
                    <>
                      <span className="text-sm">•</span>
                      <span className="text-sm">
                        {featuredMovie.metadata.creator}
                      </span>
                    </>
                  )}
                </div>

                <p
                  className="text-gray-200 text-lg mb-6 line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(featuredMovie.metadata.description),
                  }}
                />

                <div className="flex gap-4">
                  <Button
                    onPress={() => openPage(featuredMovie.metadata.identifier)}
                    size="lg"
                  >
                    Watch
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        {visibleCategories.map((category) => (
          <CategoryRow
            key={category.name}
            title={category.name}
            movies={category.movies}
            userPreferences={userPreferences}
            likes={likes}
            openPage={openPage}
            onNotInterested={onNotInterested}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsView;
