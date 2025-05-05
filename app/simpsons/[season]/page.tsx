import Link from 'next/link';
import { Suspense } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSeasonsCount } from '@/app/queries';
import EpisodesList from '@/app/components/EpisodesList';
import ItemsListSkeleton from '@/app/components/ItemsListSkeleton';

export default async function Page({ params }: { params: Promise<{ season: string }> }) {
  const { season: seasonId } = await params;

  const seasonsCount = await getSeasonsCount();
  const hasNextSeason = Number(seasonId) < seasonsCount;
  const nextSeason = Number(seasonId) + 1;
  const hasPrevSeason = Number(seasonId) > 1;
  const prevSeason = Number(seasonId) - 1;

  return (
    <>
      <div className='flex flex-wrap flex-row justify-center items-center mb-3'>
        <Link href={`/simpsons/${prevSeason}`} className={clsx({ 'pointer-events-none': !hasPrevSeason })}>
          <Button size="icon" disabled={!hasPrevSeason}><ChevronLeft/></Button>
        </Link>
        <p className='text-center m-2 sm:w-auto'>{seasonId} Сезон</p>
        <Link href={`/simpsons/${nextSeason}`} className={clsx({ 'pointer-events-none': !hasNextSeason })}>
          <Button size="icon" disabled={!hasNextSeason}><ChevronRight/></Button>
        </Link>
      </div>

      <Suspense fallback={<ItemsListSkeleton count={20} />}>
        <EpisodesList seasonId={Number(seasonId)} />
      </Suspense>
    </>
  )
}