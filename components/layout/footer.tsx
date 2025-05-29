"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/about") {
    return null;
  }

  return (
    <footer className="w-full px-6 items-center text-small justify-center py-3">
      <div className="max-w-7xl m-auto text-center">
        <Link href="/about" className="text-primary">
          All media
        </Link>{" "}
        is sourced from public archives and is provided as-is. Viewer discretion
        is advised.
      </div>
    </footer>
  );
}
