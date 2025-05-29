"use client";

import type { Review as ReviewType } from "@/types";

import { clsx } from "clsx";
import { useState } from "react";

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={clsx("size-5", className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}

export default function Review({ review }: { review: ReviewType }) {
  const [isFull, setIsFull] = useState(false);
  const shouldBeCliped = review.reviewbody.split(" ").length > 100;
  const clipedBody = isFull
    ? review.reviewbody
    : review.reviewbody.split(" ").slice(0, 100).join(" ") + "...";
  const reviewBody = shouldBeCliped ? clipedBody : review.reviewbody;

  return (
    <>
      <h3 className="text-primary text-large">{review.reviewtitle}</h3>
      <h6 className="text-small mb-2">by {review.reviewer}</h6>

      <div className="flex mb-4">
        {new Array(5).fill("").map((_, index) => (
          <Star
            className={
              index + 1 <= Number(review.stars) ? "text-yellow-400" : ""
            }
            key={index}
          />
        ))}
      </div>

      <p className="text-pretty overflow-clip">
        {reviewBody}{" "}
        {shouldBeCliped && (
          <div
            className="text-primary inline cursor-pointer"
            onClick={() => setIsFull((prev) => !prev)}
            onKeyPress={() => setIsFull((prev) => !prev)}
            role="button"
            tabIndex={0}
          >
            {isFull ? "Less" : "More"}
          </div>
        )}
      </p>
    </>
  );
}
