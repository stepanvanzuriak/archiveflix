"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ArrowDown, ArrowUp, SearchIcon } from "../layout/icons";

const items = [
  {
    key: "num_reviews",
    label: "Number of review",
  },
  {
    key: "avg_rating",
    label: "Rating",
  },
  { key: "num_favorites", label: "Number of favorites" },
  { key: "addeddate", label: "Added date" },
  { key: "random", label: "Random" },
];

const filters = [
  { key: "watched", label: "Watched" },
  { key: "liked", label: "Liked" },
  { key: "not_interested", label: "Not interested" },
];

function FilterSelect({ onChange }: { onChange: (items: string[]) => void }) {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") as string;
  const [selectedKeys, setSelectedKeys] = useState(
    new Set((filter || "not_interested").split(",")),
  );

  const selectedValue = useMemo(
    () =>
      Array.from(selectedKeys)
        .map((key) => filters.find((item) => item.key === key)?.label)
        .join(", "),
    [selectedKeys],
  );

  useEffect(() => {
    onChange(Array.from(selectedKeys));
  }, [selectedKeys, onChange]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className={clsx("capitalize w-40", {
            "border-white": Boolean(selectedValue),
          })}
          variant="bordered"
        >
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
              d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
            />
          </svg>
          Change filters
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Multiple selection example"
        closeOnSelect
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        variant="flat"
        // @ts-expect-error Complex type
        onSelectionChange={setSelectedKeys}
      >
        {filters.map((item) => (
          <DropdownItem key={item.key}>{item.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default function ListControls() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort =
    (searchParams.get("sort") as string) || "num_reviews desc";
  const currentSearch = searchParams.get("search");
  const [key, order] = currentSort.split(" ");

  const createSortPageURL = (sortKey: string, sortOrder: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("sort", `${sortKey} ${sortOrder}`);

    return `${pathname}?${params.toString()}`;
  };

  const createSearchPageURL = (title: string) => {
    const params = new URLSearchParams(searchParams);

    if (!title.length) {
      params.delete("search");

      return `${pathname}?${params.toString()}`;
    }

    params.set("search", title);

    return `${pathname}?${params.toString()}`;
  };

  const onSearch = useCallback(
    debounce((value: string) => {
      const nextURL = createSearchPageURL(value);

      router.push(nextURL);
    }, 500),
    [],
  );

  const onChangeFilter = useCallback(
    (filters: string[]) => {
      const params = new URLSearchParams(searchParams);

      params.set("filter", filters.join(","));

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="flex sm:flex-row flex-col justify-between sm:gap-2 gap-4">
      <Input
        classNames={{
          base: "max-w-full sm:max-w-[14rem] h-10",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
        }}
        placeholder="Filter by title"
        size="sm"
        startContent={<SearchIcon size={18} />}
        type="search"
        defaultValue={currentSearch || ""}
        onChange={(event) => onSearch(event.target.value)}
      />

      <div className="flex gap-2 items-center">
        <FilterSelect onChange={onChangeFilter} />

        <div>
          <ButtonGroup variant="flat">
            <Button
              isIconOnly
              variant="ghost"
              onPress={() =>
                router.push(
                  order === "desc"
                    ? createSortPageURL(key, "asc")
                    : createSortPageURL(key, "desc"),
                )
              }
            >
              {order === "desc" ? <ArrowDown /> : <ArrowUp />}
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">
                  {items.find((item) => item.key === key)?.label}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) =>
                  router.push(createSortPageURL(key as string, order))
                }
                aria-label="Dynamic Actions"
                items={items}
              >
                {(item) => (
                  <DropdownItem key={item.key}>{item.label}</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
