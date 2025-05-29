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

import { useUserStore } from "@/stores/user-store-provider";

export default function UserProfile() {
  const filter = useUserStore((store) => store.filter);
  const removeFilter = useUserStore((store) => store.removeFromFilter);

  return (
    <div>
      <h2 className="text-2xl mb-4">Not interested</h2>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {filter.map((id) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>
                <Button onPress={() => removeFilter(id)}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
