import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="space-y-5">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <Skeleton className="h-[700px] w-full rounded-xl" />
    </section>
  );
}
