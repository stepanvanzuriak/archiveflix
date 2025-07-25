"use client";
import Image from "next/image";
import { Button } from "@heroui/button";
import { sampleSize } from "lodash";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

import Loading from "../layout/loading";
import VideoCard from "../video/video-card";

import { useUserStore } from "@/stores/user-store-provider";
import { COMMON_WORDS } from "@/constants";
import { fetcher, getItem, getItems } from "@/service/api";
import { cleanHTML, processArrayOrString } from "@/utils";

interface MovieData {
  files: { name: string }[];
  metadata: {
    description: string;
    title: string;
    identifier: string;
    creator?: string;
    date?: string;
    subject?: string[];
    genre?: string[];
    language?: string[];
  };
}

interface RecommendationCategory {
  name: string;
  collection?: string;
  title?: string;
  sort?: string;
}

interface CategoryData {
  movies: MovieData[];
  isLoading: boolean;
  hasMore: boolean;
  mutateItems: (id: string) => Promise<void>;
}

interface UserPreferences {
  creators: Set<string>;
  subjects: Set<string>;
  genres: Set<string>;
  languages: Set<string>;
  years: Set<number>;
  keywords: Set<string>;
}

// Constants
const MOVIES_PER_CATEGORY = 4;

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

  if (validLikedMovies.length === 0) {
    return {
      creators: new Set<string>(),
      subjects: new Set<string>(),
      genres: new Set<string>(),
      languages: new Set<string>(),
      years: new Set<number>(),
      keywords: new Set<string>(),
    };
  }

  const preferences: UserPreferences = {
    creators: new Set(),
    subjects: new Set(),
    genres: new Set(),
    languages: new Set(),
    years: new Set(),
    keywords: new Set(),
  };

  validLikedMovies.forEach((movie) => {
    const { metadata } = movie;

    if (metadata.creator) {
      preferences.creators.add(metadata.creator.toLowerCase());
    }

    processArrayOrString(metadata.subject, (subject) => {
      preferences.subjects.add(subject.toLowerCase());
    });

    if (metadata.genre) {
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

  if (metadata.genre) {
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
  categoryData: Record<string, CategoryData>,
  userPreferences: UserPreferences,
  likes: string[],
): MovieData | null => {
  const allMovies = Object.values(categoryData).flatMap((data) => data.movies);

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

const useCategoryData = (
  category: RecommendationCategory,
  isActive: boolean,
  filter: string[],
): CategoryData => {
  const estimatedExtraRows = Math.ceil(filter.length / CATEGORIES.length);
  const initialRows = MOVIES_PER_CATEGORY + estimatedExtraRows;

  const { data, mutate, isLoading } = useSWR<{
    response: {
      docs: { identifier: string }[];
      numFound: number;
    };
  }>(
    isActive
      ? getItems(
          {
            collection: category.collection,
            title: category.title,
          },
          1, // Always fetch first page for recommendations
          {
            sort: category.sort || "downloads desc",
            rows: initialRows.toString(),
          },
        )
      : null,
    fetcher,
  );

  const movieIds = useMemo(() => {
    if (!data?.response?.docs) return [];

    const filtered = data.response.docs
      .filter(({ identifier }) => !filter.includes(identifier))
      .map(({ identifier }) => identifier);

    return filtered.slice(0, MOVIES_PER_CATEGORY);
  }, [data, filter]);

  const needsMoreData = useMemo(() => {
    if (!data?.response?.docs || !isActive) return false;

    const filteredCount = data.response.docs.filter(
      ({ identifier }) => !filter.includes(identifier),
    ).length;

    // We need more data if we have fewer filtered results than desired
    // AND there are more items available in the collection
    return (
      filteredCount < MOVIES_PER_CATEGORY &&
      data.response.docs.length < data.response.numFound
    );
  }, [data, filter, isActive]);

  useEffect(() => {
    const shouldFetchMore = needsMoreData && data && isActive;

    if (shouldFetchMore) {
      const newRowCount = Math.min(initialRows + MOVIES_PER_CATEGORY, 50);

      const newUrl = getItems(
        {
          collection: category.collection,
          title: category.title,
        },
        1,
        {
          sort: category.sort || "downloads desc",
          rows: newRowCount.toString(),
        },
      );

      mutate(fetcher(newUrl), { revalidate: false });
    }
  }, [
    needsMoreData,
    data,
    initialRows,
    category.collection,
    category.title,
    category.sort,
    isActive,
    mutate,
  ]);

  const {
    data: movies = [],
    isLoading: moviesLoading,
    mutate: mutatItems,
  } = useSWRInfinite<MovieData>(
    (index) => (movieIds[index] && isActive ? getItem(movieIds[index]) : null),
    fetcher,
    {
      initialSize: movieIds.length,
    },
  );

  const filteredMovies = useMemo(() => {
    const validMovies = movies.filter((movie) => movie?.metadata?.identifier);

    return validMovies.slice(0, MOVIES_PER_CATEGORY);
  }, [movies]);

  return {
    movies: filteredMovies,
    isLoading: isLoading || moviesLoading,
    mutateItems: async (id: string) => {
      mutatItems(movies.filter((item) => item.metadata.identifier !== id));
    },
    hasMore:
      (data?.response?.numFound || 0) > (data?.response?.docs?.length || 0),
  };
};

// Category Row Component
const CategoryRow: React.FC<{
  title: string;
  categoryData: CategoryData;
  userPreferences: UserPreferences;
  likes: string[];
  openPage: (name: string) => void;
}> = ({ title, categoryData, userPreferences, likes, openPage }) => {
  const { movies, isLoading, mutateItems } = categoryData;

  const sortedMovies = useMemo(() => {
    return sortMoviesByScore(movies, userPreferences, likes);
  }, [movies, userPreferences, likes]);

  const onNotInterested = useCallback(
    (id: string) => {
      mutateItems(id);
    },
    [mutateItems],
  );

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex space-x-4 overflow-x-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-64 h-44 rounded-lg animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

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

// Main Component
const HomeRecommendations: React.FC = () => {
  const router = useRouter();
  const [featuredMovie, setFeaturedMovie] = useState<MovieData | null>(null);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  const likes = useUserStore((store) => store.likes);
  const filter = useUserStore((store) => store.filter);
  const watched = useUserStore((store) => store.watched);

  const randomLikes = useMemo(() => {
    return sampleSize(likes, Math.min(30, likes.length));
  }, [likes]);

  const { data: likedMovies = [], isLoading: likesLoading } =
    useSWRInfinite<MovieData>(
      (index) => (randomLikes[index] ? getItem(randomLikes[index]) : null),
      fetcher,
      {
        initialSize: randomLikes.length,
        revalidateFirstPage: false,
      },
    );

  const userPreferences = useMemo(() => {
    return extractUserPreferences(likedMovies);
  }, [likedMovies]);

  const filteredItems = Array.from(new Set([...filter, ...likes, ...watched]));

  const popularData = useCategoryData(
    CATEGORIES[0],
    activeCategories.includes("Popular Classic Films"),
    filteredItems,
  );
  const educationData = useCategoryData(
    CATEGORIES[1],
    activeCategories.includes("Educational Content"),
    filteredItems,
  );
  const animationData = useCategoryData(
    CATEGORIES[2],
    activeCategories.includes("Animation Collection"),
    filteredItems,
  );

  const categoryData = useMemo(
    () => ({
      "Popular Classic Films": popularData,
      "Educational Content": educationData,
      "Animation Collection": animationData,
    }),
    [popularData, educationData, animationData],
  );

  const openPage = useCallback(
    (name: string) => {
      router.push(`/${name}`);
    },
    [router],
  );

  // Check if any category is still loading
  const isAnyLoading = useMemo(
    () =>
      Object.values(categoryData).some((data) => data.isLoading) ||
      likesLoading,
    [categoryData, likesLoading],
  );

  useEffect(() => {
    setActiveCategories(CATEGORIES.map((cat) => cat.name));
  }, []);

  useEffect(() => {
    if (!featuredMovie && !likesLoading) {
      const featured = findFeaturedMovie(categoryData, userPreferences, likes);

      if (featured) {
        setFeaturedMovie(featured);
      }
    }
  }, [categoryData, featuredMovie, userPreferences, likes, likesLoading]);

  const [thumbnail] = featuredMovie
    ? featuredMovie.files.filter(({ name }) => name === "__ia_thumb.jpg")
    : [];

  if (isAnyLoading && !featuredMovie) {
    return <Loading className="h-full" />;
  }

  return (
    <div className="flex-grow w-full">
      {featuredMovie && (
        <div className="relative h-96 mb-8 overflow-hidden rounded-md">
          {thumbnail && (
            <div className="absolute inset-0">
              <Image
                fill
                priority
                alt={featuredMovie.metadata.title}
                className="object-cover object-center grayscale blur-sm"
                sizes="100vw"
                src={`https://archive.org/download/${featuredMovie.metadata.identifier}/${thumbnail.name}`}
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

          <div className="relative z-20 h-full flex items-center">
            <div className="flex items-center gap-8 px-12 w-full">
              {thumbnail && (
                <div className="flex-shrink-0 hidden sm:block">
                  <div className="relative w-48 h-72 rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      fill
                      priority
                      alt={featuredMovie.metadata.title}
                      className="object-cover rounded-md"
                      sizes="192px"
                      src={`https://archive.org/download/${featuredMovie.metadata.identifier}/${thumbnail.name}`}
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
        {CATEGORIES.map((category) => {
          const data = categoryData[category.name as keyof typeof categoryData];

          if (!data || !activeCategories.includes(category.name)) return null;

          return (
            <CategoryRow
              key={category.name}
              title={category.name}
              categoryData={data}
              userPreferences={userPreferences}
              likes={likes}
              openPage={openPage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomeRecommendations;
