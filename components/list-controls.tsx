"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const ArrowDown = () => {
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
};

const ArrowUp = () => {
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
};

const SORT_ORDERS = {
  num_reviews_desc: "num_reviews desc",
  num_reviews_asc: "num_reviews asc",
};

const ListControls = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") as string;

  const createSortPageURL = (sortOrder: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("sort", sortOrder);

    return `${pathname}?${params.toString()}`;
  };

  const nextSort =
    currentSort === SORT_ORDERS.num_reviews_asc
      ? SORT_ORDERS.num_reviews_desc
      : SORT_ORDERS.num_reviews_asc;

  return (
    <div className="flex gap-2">
      <Link href={createSortPageURL(nextSort)}>
        <Button
          color="primary"
          className="bg-transparent border-primary border-2 text-primary"
        >
          Number of reviews{" "}
          {currentSort === SORT_ORDERS.num_reviews_asc ? (
            <ArrowUp />
          ) : (
            <ArrowDown />
          )}
        </Button>
      </Link>
    </div>
  );
};

export default ListControls;
