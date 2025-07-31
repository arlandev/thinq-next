import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
}

export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl flex-grow flex flex-col w-full h-full">
      <div className="flex flex-col h-full w-full">
        <Table className="h-full w-full">
          <TableBody className="h-full w-full">
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index} className="h-full">
                <TableCell className="w-full">
                  <div className="flex items-center space-x-4 w-full">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 