import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { getEpisodes, getSeasonsCount } from '@/app/queries';
import { ToggleSeenButton } from '@/app/components/ToogleSeenButton';

export default async function Page({ params }: { params: Promise<{ season: string }> }) {
  const { season: seasonId } = await params;
  const episodes = await getEpisodes(Number(seasonId));

  if (!episodes.length) {
    return (
      <>
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-2xl font-bold mb-4'>{seasonId} Сезон не знайдено</p>
          <Link href='/simpsons'>
            <Button>На головну</Button>
          </Link>
        </div>
      </>
    );
  }

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
      
      <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10'>
        {episodes.map(({ poster, number, season_id, seen }) => {
          return (
            <div className='flex flex-col justify-center' key={number}>
              <Link  href={`/simpsons/${Number(season_id)}/episode/${Number(number)}`} key={number}>
                <Image src={`https://simpsons-images.s3.eu-north-1.amazonaws.com/optimized_images/${season_id}x${number}.webp`} alt="" width={256} height={269} className='rounded-lg mb-3 w-full'/>
              </Link>
              <div className='flex flex-row items-center justify-between'>
                <h6 className='text-lg'>{number} Епізод</h6>
                <ToggleSeenButton
                  noLabel
                  seen={seen}
                  seasonId={seasonId}
                  episodeNumber={number}
                />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}