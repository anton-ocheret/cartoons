import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getEpisodes, getSeasonsCount, getSeenEpisodes } from '@/app/queries';
import { TogleSeenButton } from '@/app/components/ToogleSeenButton';

export default async function Page({ params }: { params: Promise<{ season: string }> }) {
  const { season: seasonId } = await params;
  const episodes = await getEpisodes(Number(seasonId));

  if (!episodes) {
    return (
      <>
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-2xl font-bold mb-4'>Сезон не найден</p>
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

  const seenEpisodes = await getSeenEpisodes(Number(seasonId));

  return (
    <>
      <div className='flex flex-col flex-wrap sm:flex-row sm:justify-between sm:items-center'>
        <div className='flex w-full justify-center order-3 sm:w-auto sm:order-1'>
          {
            hasPrevSeason && (
              <Link href={`/simpsons/${prevSeason}`} className='m-2 first:sm:ml-0'>
                <Button>Попередній сезон</Button>
              </Link>
            )
          }
        </div>
        <p className='flex-shrink-0 text-center w-full m-2 order-1 sm:w-auto'>{seasonId} Сезон</p>
        <div className='flex w-full justify-center order-3 sm:w-auto'>
          {
            hasNextSeason && (
              <Link href={`/simpsons/${nextSeason}`} className='m-2 first:sm:mr-0'>
                <Button>Наступний сезон</Button>
              </Link>
            )
          }
        </div>
      </div>
      
      <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10'>
        {episodes.map(({ poster, number, season_id, id }) => {
          const isSeen = seenEpisodes.some((episode) => episode.episode_id === Number(id));
          return (
            <div className='flex flex-col justify-center' key={number}>
              <Link  href={`/simpsons/${Number(season_id)}/episode/${Number(number)}`} key={number}>
                <Image src={poster} alt="" width={256} height={269} className='rounded-lg mb-3 w-full'/>
              </Link>
              <div className='flex flex-row items-center justify-between'>
                <h6 className='text-lg'>{number} Епізод</h6>
                <TogleSeenButton
                  noLabel
                  seen={isSeen}
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