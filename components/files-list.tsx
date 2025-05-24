"use client";

import { Link } from "@heroui/link";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

const FilesList = ({
  files,
  identifier,
}: {
  files: Record<string, string>[];
  identifier: string;
}) => {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>TYPE</TableColumn>
        <TableColumn>LINK</TableColumn>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.sha1}>
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
