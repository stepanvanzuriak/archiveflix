"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function NextPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", pageNumber.toString());

    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex gap-5">
      {currentPage - 1 > 0 && (
        <Link href={createPageURL(currentPage - 1)}>
          <Button color="primary">Previous</Button>
        </Link>
      )}
      <Link href={createPageURL(currentPage + 1)}>
        <Button color="primary">Next</Button>
      </Link>
    </div>
  );
}
