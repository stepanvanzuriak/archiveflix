"use client";
import type { Review } from "@/types";

import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import { Link } from "@heroui/link";

import FilesList from "./files-list";
import Reviews from "./reviews";

function MetadataItem({
  item,
  title,
  isLink = false,
}: {
  item: unknown | undefined;
  title: string;
  isLink?: boolean;
}) {
  return (
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
    )
  );
}

export default function Details({
  identifier,
  metadata,
  files,
  reviews,
}: {
  identifier: string;
  files: Record<string, string>[];
  metadata: Record<string, unknown>;
  reviews: Review[];
}) {
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
          <Reviews reviews={reviews} />
        </Tab>
      </Tabs>
    </div>
  );
}
