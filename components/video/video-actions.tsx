"use client";

import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

import { HeartIcon, HideIcon, Watched } from "../layout/icons";

import { useUserStore } from "@/stores/user-store-provider";

export default function VideoActions({
  identifier,
  onNotInterested,
  redirectOnNotInterested,
  withExpandedVersion,
}: {
  identifier: string;
  onNotInterested?: (id: string) => void;
  redirectOnNotInterested?: boolean;
  withExpandedVersion?: boolean;
}) {
  const router = useRouter();
  const notInterested = useUserStore((store) => store.addToFilter);
  const likeVideo = useUserStore((store) => store.addToLikes);
  const addToWatched = useUserStore((store) => store.setWatched);
  const notInterestedFilter = useUserStore((store) => store.filter);
  const likes = useUserStore((state) => state.likes);
  const watched = useUserStore((state) => state.watched);

  const isNotInterested = useMemo(() => {
    return notInterestedFilter.includes(identifier);
  }, [identifier, notInterestedFilter]);

  const isLiked = useMemo(() => {
    return likes.includes(identifier);
  }, [identifier, likes]);

  const isWatched = useMemo(() => {
    return watched.includes(identifier);
  }, [watched, identifier]);

  const handleDropDown = useCallback(
    async (key: string, id: string) => {
      if (key === "not_interested") {
        notInterested(id);
        if (onNotInterested) {
          onNotInterested(id);
        }

        if (redirectOnNotInterested) {
          setTimeout(() => {
            router.push("/");
          }, 100);
        }
      } else if (key === "like") {
        likeVideo(id);
      } else if (key === "watched") {
        addToWatched(id);
      }
    },
    [
      addToWatched,
      likeVideo,
      notInterested,
      onNotInterested,
      redirectOnNotInterested,
      router,
    ],
  );

  return (
    <>
      <Dropdown>
        <DropdownTrigger className="text-primary min-w-[24px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={clsx("size-6 cursor-pointer", {
              "sm:hidden": withExpandedVersion,
            })}
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
          onAction={(key) => handleDropDown(key as string, identifier)}
        >
          <DropdownItem
            startContent={
              <Watched
                className={clsx({
                  "text-blue-400": isWatched,
                })}
              />
            }
            key="watched"
          >
            Watched
          </DropdownItem>
          <DropdownItem
            startContent={
              <HeartIcon
                className={clsx({
                  "text-red-400": isLiked,
                })}
              />
            }
            key="like"
          >
            Like
          </DropdownItem>
          <DropdownItem
            startContent={
              <HideIcon
                className={clsx({
                  "text-yellow-400": isNotInterested,
                })}
              />
            }
            key="not_interested"
          >
            Not interested
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {withExpandedVersion && (
        <div className="sm:flex hidden gap-4">
          <Button
            aria-label="Watched"
            size="sm"
            variant="bordered"
            radius="md"
            isIconOnly
            className={clsx({
              "border-blue-400": isLiked,
            })}
            onPress={() => handleDropDown("like", identifier)}
          >
            <Watched />
          </Button>

          <Button
            aria-label="Like"
            size="sm"
            variant="bordered"
            radius="md"
            isIconOnly
            className={clsx({
              "border-red-400": isLiked,
            })}
            onPress={() => handleDropDown("like", identifier)}
          >
            <HeartIcon />
          </Button>

          <Button
            aria-label="Not interested"
            size="sm"
            variant="bordered"
            radius="md"
            isIconOnly
            className={clsx({
              "border-yellow-400": isNotInterested,
            })}
            onPress={() => handleDropDown("not_interested", identifier)}
          >
            <HideIcon />
          </Button>
        </div>
      )}
    </>
  );
}
