"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function ArrowDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      />
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
      />
    </svg>
  );
}

const SORT_ORDERS = {
  num_reviews_desc: "num_reviews desc",
  num_reviews_asc: "num_reviews asc",
  avg_rating_desc: "avg_rating desc",
  avg_rating_asc: "avg_rating asc",
};

function Control({
  createSortPageURL,
  currentSort,
  ascState,
  descState,
  name,
  mobileName,
}: {
  mobileName: string;
  name: string;
  ascState: string;
  descState: string;
  currentSort: string;
  createSortPageURL: (url: string) => string;
}) {
  if (currentSort !== ascState && currentSort !== descState) {
    return (
      <Link href={createSortPageURL(descState)}>
        <Button
          color="primary"
          className="bg-transparent border-primary border-2 text-primary"
        >
          <span className="hidden sm:inline">{name}</span>
          <span className="sm:hidden inline">{mobileName}</span>
        </Button>
      </Link>
    );
  }

  const nextSort = currentSort === ascState ? descState : ascState;

  return (
    <Link href={createSortPageURL(nextSort)}>
      <Button
        color="primary"
        className="bg-transparent border-primary border-2 text-primary"
      >
        <span className="hidden sm:flex items-center gap-2">
          {name} {currentSort === ascState ? <ArrowUp /> : <ArrowDown />}
        </span>
        <span className="sm:hidden flex items-center gap-2">
          {mobileName} {currentSort === ascState ? <ArrowUp /> : <ArrowDown />}
        </span>
      </Button>
    </Link>
  );
}

export default function ListControls() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort =
    (searchParams.get("sort") as string) || "num_reviews desc";

  const createSortPageURL = (sortOrder: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("sort", sortOrder);

    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex gap-2">
      <Control
        name="Number of reviews"
        mobileName="# reviews"
        createSortPageURL={createSortPageURL}
        currentSort={currentSort}
        ascState={SORT_ORDERS.num_reviews_asc}
        descState={SORT_ORDERS.num_reviews_desc}
      />
      <Control
        name="Average user rating"
        mobileName="Avg. user rating"
        createSortPageURL={createSortPageURL}
        currentSort={currentSort}
        ascState={SORT_ORDERS.avg_rating_asc}
        descState={SORT_ORDERS.avg_rating_desc}
      />
    </div>
  );
}
