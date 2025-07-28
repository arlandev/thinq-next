import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 8 }: TableSkeletonProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl flex-grow flex flex-col">
      <div className="flex flex-col h-full">
        <Table className="h-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/12"></TableHead>
              <TableHead className="w-1/12">User ID</TableHead>
              <TableHead className="w-3/12">Email</TableHead>
              <TableHead className="w-1/12">First Name</TableHead>
              <TableHead className="w-1/12">Last Name</TableHead>
              <TableHead className="w-2/12">Type</TableHead>
              <TableHead className="w-1/12">Affiliation</TableHead>
              <TableHead className="w-1/12">Status</TableHead>
              <TableHead className="w-3/12 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-full">
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 