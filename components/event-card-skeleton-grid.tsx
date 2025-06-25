import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonCard = () => (
  <Card className="flex flex-col justify-between h-full">
    <CardHeader className="p-4">
      <Skeleton className="h-4 w-1/2 bg-muted" />
      <Skeleton className="h-3 w-1/3 mt-2 bg-muted" />
    </CardHeader>
    <CardContent className="p-4 space-y-2 flex-1">
      <Skeleton className="h-3 w-full bg-muted" />
      <Skeleton className="h-3 w-3/4 bg-muted" />
      <Skeleton className="h-3 w-1/2 bg-muted" />
    </CardContent>
    <CardFooter className="p-4 space-x-2">
      <Skeleton className="h-8 w-24 bg-muted" />
      <Skeleton className="h-8 w-24 bg-muted" />
    </CardFooter>
  </Card>
);

export const SkeletonGrid = ({ count = 9 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);