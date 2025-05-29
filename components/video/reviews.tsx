import type { Review as ReviewType } from "@/types";

import { useState, useMemo } from "react";
import { Pagination } from "@heroui/pagination";

import Review from "./review";

export default function Reviews({ reviews }: { reviews: ReviewType[] }) {
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;
  const pages = Math.ceil(reviews.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return reviews.slice(start, end);
  }, [page, reviews]);

  return (
    <ul>
      {items.map((review) => (
        <li
          className="mb-4 bg-content1 p-4 rounded-large"
          key={`${review.reviewtitle}`}
        >
          <Review review={review} />
        </li>
      ))}
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    </ul>
  );
}
