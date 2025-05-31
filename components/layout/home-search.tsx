"use client";

import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { useCallback } from "react";
import { debounce } from "lodash";

import { SearchIcon } from "./icons";

export default function HomeSearch() {
  const router = useRouter();
  const createSearchPageURL = (title: string) => {
    const params = new URLSearchParams();

    if (!title.length) {
      params.delete("search");

      return `/?${params.toString()}`;
    }

    params.set("search", title);

    return `/?${params.toString()}`;
  };

  const onSearch = useCallback(
    debounce((value: string) => {
      const nextURL = createSearchPageURL(value);

      router.push(nextURL);
    }, 500),
    [],
  );

  return (
    <div className="md:max-w-[50%] w-full">
      <h1 className="mb-8 text-3xl text-center">Search videos by title</h1>
      <Input
        fullWidth
        className="w-full"
        placeholder="Type to search..."
        size="sm"
        startContent={<SearchIcon size={18} />}
        type="search"
        classNames={{
          base: "h-12",
          mainWrapper: "h-full",
          input:
            "text-small text-primary group-data-[has-value=true]:text-primary",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
        }}
        onChange={(event) => onSearch(event.target.value)}
      />
    </div>
  );
}
