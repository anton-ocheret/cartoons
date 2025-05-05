import { Skeleton } from '@/components/ui/skeleton';

export default function ItemsListSkeleton({ count = 25 }: { count?: number }) {
  return (
    <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10'>
      {
        Array.from({ length: count }).map((_, index) => (
          <div className='flex flex-col justify-center' key={index}>
            <div className='mb-3'>
              <Skeleton className='w-full h-[112px] rounded-lg' />
            </div>
            <div className='flex md:flex-row items-center justify-between'>  
              <Skeleton className='h-[28px] w-[64px] rounded-full' />
              <Skeleton className='h-[28px] w-[64px] rounded-full' />
            </div>
          </div>
        ))
      }
    </div>
  );
}