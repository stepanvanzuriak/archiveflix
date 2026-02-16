"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Button } from "@heroui/button";
import Link from "next/link";

import { useUserStore } from "@/stores/user-store-provider";

export default function UserProfile() {
  const filter = useUserStore((store) => store.filter);
  const likes = useUserStore((store) => store.likes);
  const watched = useUserStore((store) => store.watched);
  const removeLike = useUserStore((state) => state.addToLikes);
  const removeFilter = useUserStore((store) => store.addToFilter);
  const removeWatched = useUserStore((store) => store.setWatched);

  return (
    <div className="flex sm:flex-row flex-col gap-8">
      <div className="sm:w-1/2">
        <h2 className="text-2xl mb-4">Likes</h2>
        {likes.length === 0 ? (
          <p className="text-default-500 mb-8">No liked movies yet</p>
        ) : (
          <Table aria-label="Likes" className="mb-8">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {likes.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <Link className="cursor-pointer underline" href={`/${id}`}>
                      {id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button onPress={() => removeLike(id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <h2 className="text-2xl mb-4">Watched</h2>
        {watched.length === 0 ? (
          <p className="text-default-500">No watched movies yet</p>
        ) : (
          <Table aria-label="Watched">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {watched.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <Link className="cursor-pointer underline" href={`/${id}`}>
                      {id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button onPress={() => removeWatched(id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="sm:w-1/2">
        <h2 className="text-2xl mb-4">Not interested</h2>
        {filter.length === 0 ? (
          <p className="text-default-500">No filtered movies yet</p>
        ) : (
          <Table aria-label="Not interested">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filter.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <Link className="cursor-pointer underline" href={`/${id}`}>
                      {id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button onPress={() => removeFilter(id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
