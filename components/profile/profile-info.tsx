"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";

import { useUserStore } from "@/stores/user-store-provider";

const UserProfile = () => {
  const name = useUserStore((store) => store.name);
  const filter = useUserStore((store) => store.filter);

  return (
    <div>
      <h1 className="text-3xl mb-4">{name}</h1>

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
              <TableCell>Active</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserProfile;
