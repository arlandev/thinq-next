import { Skeleton } from "@/components/ui/skeleton";

export function PendingCountSkeleton() {
  return (
    <div className="bg-black rounded-xl py-6 text-center">
      <div className="text-white">
        <Skeleton className="h-12 w-16 mx-auto mb-2 bg-gray-600" />
        <Skeleton className="h-6 w-20 mx-auto bg-gray-600" />
      </div>
    </div>
  );
} 