"use client";
import { useMemo, useState } from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";

const ChevronDown = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`size-4 ${className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
};

const TopControls = ({
  formats,
  formatFilter,
  setFormatFilter,
}: {
  formats: string[];
  formatFilter: string;
  setFormatFilter: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <button>
        <h1 className="text-lg text-primary flex items-center">Files</h1>
      </button>
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by name..."
          size="sm"
          // startContent={<SearchIcon className="text-default-300" />}
          // value={filterValue}
          variant="bordered"
          // onClear={() => setFilterValue("")}
          // onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDown className="text-small" />}
                size="sm"
                variant="flat"
              >
                Type: {formatFilter}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={[formatFilter]}
              selectionMode="multiple"
              onSelectionChange={(key) =>
                setFormatFilter(key.currentKey as string)
              }
            >
              {["All", ...formats].map((format) => (
                <DropdownItem key={format}>{format}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

const FilesList = ({
  files,
  identifier,
}: {
  files: Record<string, string>[];
  identifier: string;
}) => {
  const [page, setPage] = useState(1);
  const [currentFormat, setCurrentFormat] = useState("All");

  const filteredFiles = useMemo(() => {
    return files.filter((item) =>
      currentFormat === "All" ? true : item.format === currentFormat,
    );
  }, [files, currentFormat]);

  const rowsPerPage = 10;
  const pages = Math.ceil(filteredFiles.length / rowsPerPage);
  const formats = Array.from(new Set(files.map((file) => file.format)));

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredFiles.slice(start, end);
  }, [page, filteredFiles]);

  return (
    <Table
      topContent={
        <TopControls
          formatFilter={currentFormat}
          formats={formats}
          setFormatFilter={setCurrentFormat}
        />
      }
      bottomContent={
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
      }
      removeWrapper
      isCompact
      aria-label="Example static collection table"
    >
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>TYPE</TableColumn>
        <TableColumn>LINK</TableColumn>
      </TableHeader>
      <TableBody>
        {items.map((file) => (
          <TableRow key={file.name}>
            <TableCell>{file.name}</TableCell>
            <TableCell>{file.format}</TableCell>
            <TableCell>
              <Link
                isExternal
                showAnchorIcon
                href={`https://archive.org/download/${identifier}/${file.name}`}
              >
                Open
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FilesList;
