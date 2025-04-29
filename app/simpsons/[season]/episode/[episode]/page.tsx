import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TogleSeenButton } from '@/app/components/ToogleSeenButton';
import { getEpisode, getEpisodesCount, getSeasonsCount, getSeen } from '@/app/queries';
import { Suspense } from 'react'; 
import dynamic from 'next/dynamic';

const HlsPlayer = dynamic(() => import('@/app/components/HlsPlayer'), { ssr: false });

export default async function Page({ params }: { params: Promise<{ season: string, episode: string }> }) {
  const { season: seasonId, episode: episodeNumber } = await params;
  const seasonsCount = await getSeasonsCount();
  const episodesCount = await getEpisodesCount(Number(seasonId));
  const episodeData = await getEpisode(Number(seasonId), Number(episodeNumber));
  const noSeasonData = Number(seasonId) > seasonsCount;

  if (!episodeData || noSeasonData) {
    const seasonToGo = Number(seasonId) > Number(seasonsCount) ? 1 : Number(seasonId) ;
    return (
      <>
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-2xl font-bold mb-4'>Епізод не найден</p>
          <Link href={`/simpsons/${seasonToGo}`}>  
            <Button>До епізодів {seasonToGo} сезону</Button>
          </Link>
        </div>
      </>
    );
  }

  const seen = await getSeen(Number(seasonId), Number(episodeData.id));

  const { video } = episodeData;

  const hasPrevEpisode = Number(episodeNumber) > 1;
  const prevEpisode = Number(episodeNumber) - 1;
  const hasNextEpisode = Number(episodeNumber) < Number(episodesCount);
  const nextEpisode = Number(episodeNumber) + 1;

  const hasNextSeason = Number(seasonId) < Number(seasonsCount);
  const nextSeason = Number(seasonId) + 1;
  const hasPrevSeason = Number(seasonId) > 1;
  const prevSeason = Number(seasonId) - 1;
  
  return (
    <div>
      <TogleSeenButton
        seen={Boolean(seen)}
        seasonId={seasonId}
        episodeNumber={episodeNumber}
      />
      <div className='flex flex-col flex-wrap sm:flex-row sm:justify-between sm:items-center'>
        <div className='flex w-full justify-center order-3 sm:w-auto sm:order-1'>
          {
            hasPrevSeason && (
              <Link href={`/simpsons/${prevSeason}/episode/1`} className='m-2 first:sm:ml-0'>
                <Button>Попередній сезон</Button>
              </Link>
            )
          }
          {
            hasNextSeason && (
              <Link href={`/simpsons/${nextSeason}/episode/1`} className='m-2 first:sm:ml-0'>
                <Button>Наступний сезон</Button>
              </Link>
            )
          }
        </div>
        <p className='flex-shrink-0 text-center w-full m-2 order-1 sm:w-auto'>{seasonId} Сезон | {episodeNumber} Епізод</p>
        <div className='flex w-full justify-center order-3 sm:w-auto'>
          {
            hasPrevEpisode && (
              <Link href={`/simpsons/${seasonId}/episode/${prevEpisode}`} className='m-2 last:sm:mr-0'>
                <Button>Попередній eпізод</Button>
              </Link>
            )
          }
          {
            hasNextEpisode && (
              <Link href={`/simpsons/${seasonId}/episode/${nextEpisode}`} className='m-2 last:sm:mr-0'>
                <Button>Наступний епізод</Button>
              </Link>
            )
          }
        </div>
      </div>
      <div className='flex flex-col items-center justify-center'> 
        <Suspense fallback={<div>Loading...</div>}>
          <HlsPlayer
            videoUrl={video}
            hasNextEpisode={hasNextEpisode}
            hasNextSeason={hasNextSeason}
          />
        </Suspense>
      </div>
    </div>
  )
}