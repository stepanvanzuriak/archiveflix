import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import Image from "next/image";
import useSWR from "swr";

import { fetcher, getItem } from "@/service/api";
import { Skeleton } from "@heroui/skeleton";

const MovieCard = ({
  movie,
  openPage,
  handleDropDown,
}: {
  movie: {
    files: { name: string }[];
    metadata: {
      description: string;
      title: string;
      identifier: string;
    };
  };
  openPage: (page: string) => void;
  handleDropDown: (key: string, id: string) => void;
}) => {
  const [thumbnail] = movie.files.filter(
    ({ name }) => name === "__ia_thumb.jpg",
  );

  const description = movie.metadata.description;
  const formatedDescription =
    description && description.replace
      ? description.replace(/(<([^>]+)>)/gi, "").substring(0, 100) +
        (description.length > 100 ? "..." : "")
      : "No description";
  const title = movie.metadata.title;
  const identifier = movie.metadata.identifier;

  return (
    <button
      onClick={() => {
        openPage(identifier);
      }}
    >
      <Card className="bg-transparent text-primary border-secondary border-2 cursor-pointer">
        <CardHeader className="pb-0 flex-col items-start">
          <div className="flex items-center w-full">
            <h4
              className="text-medium uppercase font-bold truncate grow"
              title={title}
            >
              {title}
            </h4>
            <Dropdown>
              <DropdownTrigger className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Static Actions"
                onAction={(key) =>
                  handleDropDown(key as string, movie.metadata.identifier)
                }
              >
                <DropdownItem key="not_interested">Not interested</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <small
            className="text-default-500 w-full truncate"
            title={formatedDescription}
          >
            {formatedDescription}
          </small>
        </CardHeader>
        <CardBody className="overflow-visible h-44">
          {!!thumbnail && (
            <Image
              fill
              priority
              alt={thumbnail.name as string}
              className="max-w-64 max-h-40 m-auto"
              sizes="(max-width: 256px) (max-height: 160px)"
              src={`https://archive.org/download/${movie.metadata.identifier as string}/${thumbnail.name as string}`}
            />
          )}
        </CardBody>
      </Card>
    </button>
  );
};

export default MovieCard;
