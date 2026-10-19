
import Skeleton from "./ui/Skeleton"
export default function CategorySkeleton() {
  return (
    <section
      aria-label="Cargando categorías"
      aria-busy="true"
      className="w-full"
    >
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-8 w-20" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative h-[230px] overflow-hidden rounded-2xl sm:h-[260px]"
          >
            <Skeleton className="absolute inset-0 h-full w-full" />

            <div className="absolute inset-x-0 bottom-0 space-y-3 p-5">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-44 max-w-full" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
