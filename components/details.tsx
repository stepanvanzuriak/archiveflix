"use client";
import clsx from "clsx";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { Link } from "@heroui/link";

import FilesList from "./files-list";

const MetadataItem = ({
  item,
  title,
  isLink = false,
}: {
  item: unknown | undefined;
  title: string;
  isLink?: boolean;
}) =>
  !!item && (
    <p>
      {title}:{" "}
      {isLink ? (
        <Link href={item as string} isExternal showAnchorIcon>
          {item as string}
        </Link>
      ) : (
        (item as string)
      )}
    </p>
  );

const Star = ({ className }: { className?: string }) => (
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

const Details = ({
  identifier,
  metadata,
  files,
  reviews,
}: {
  identifier: string;
  files: Record<string, string>[];
  metadata: Record<string, unknown>;
  reviews: {
    createdate: string;
    reviewbody: string;
    reviewdate: string;
    reviewer: string;
    reviewer_itemname: string;
    reviewtitle: string;
    stars: string;
  }[];
}) => {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="photos" title="Details">
          <Card>
            <CardBody>
              <MetadataItem title="Date" item={metadata.date} />
              <MetadataItem
                title="Original URL"
                item={metadata.originalurl}
                isLink
              />
              <MetadataItem title="Scanner" item={metadata.scanner} />
              <MetadataItem
                title="Archive.org page"
                item={`https://archive.org/details/${identifier}`}
                isLink
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="files" title="Files">
          <Card>
            <CardBody>
              <FilesList
                identifier={identifier}
                files={files as Record<string, string>[]}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="reviews" title="Reviews">
          <ul className="bg-content1 p-4 rounded-medium">
            {reviews.map((review) => (
              <li className="mb-4" key={`${review.reviewtitle}`}>
                <div className="mb-2 flex items-center gap-4">
                  <h3 className="text-primary text-large">
                    {review.reviewtitle}
                  </h3>
                  <h6 className="text-small">by {review.reviewer}</h6>
                </div>
                <div className="flex mb-2">
                  {new Array(5).fill("").map((_, index) => (
                    <Star
                      className={
                        index + 1 <= Number(review.stars)
                          ? "text-yellow-400"
                          : ""
                      }
                      key={index}
                    />
                  ))}
                </div>

                <p className="text-pretty overflow-clip">{review.reviewbody}</p>
              </li>
            ))}
          </ul>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Details;
