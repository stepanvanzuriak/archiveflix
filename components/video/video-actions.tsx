"use client";

import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useCallback } from "react";

import { useUserStore } from "@/stores/user-store-provider";

const HideIcon = () => {
  return (
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
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
};

export default function VideoActions({
  identifier,
  onNotInterested,
  redirectOnNotInterested,
}: {
  identifier: string;
  onNotInterested?: (id: string) => void;
  redirectOnNotInterested?: boolean;
}) {
  const router = useRouter();
  const notInterested = useUserStore((store) => store.addToFilter);

  const handleDropDown = useCallback(async (key: string, id: string) => {
    if (key === "not_interested") {
      notInterested(id);
      if (onNotInterested) {
        onNotInterested(id);
      }

      if (redirectOnNotInterested) {
        router.push("/");
      }
    }
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger className="text-primary min-w-[24px]">
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
        onAction={(key) => handleDropDown(key as string, identifier)}
      >
        <DropdownItem startContent={<HideIcon />} key="not_interested">
          Not interested
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
