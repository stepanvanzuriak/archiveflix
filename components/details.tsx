"use client";

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

const Details = ({
  identifier,
  metadata,
  files,
}: {
  identifier: string;
  files: Record<string, string>[];
  metadata: Record<string, unknown>;
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
            </CardBody>
          </Card>
        </Tab>
        <Tab key="music" title="Files">
          <Card>
            <CardBody>
              <FilesList
                identifier={identifier}
                files={files as Record<string, string>[]}
              />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Details;
