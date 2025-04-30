import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ToggleSeenButton } from '@/app/components/ToogleSeenButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getEpisode, getEpisodesCount, getSeasonsCount, getSeen } from '@/app/queries';
import HlsPlayer from '@/app/components/HlsPlayer';
import clsx from 'clsx';

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

  const { video } = episodeData;

  const hasPrevEpisode = Number(episodeNumber) > 1;
  const prevEpisode = Number(episodeNumber) - 1;
  const hasNextEpisode = Number(episodeNumber) < Number(episodesCount);
  const nextEpisode = Number(episodeNumber) + 1;

  const hasNextSeason = Number(seasonId) < Number(seasonsCount);
  const nextSeason = Number(seasonId) + 1;
  const hasPrevSeason = Number(seasonId) > 1;
  const prevSeason = Number(seasonId) - 1;
  console.log(episodeData);
  return (
    <div>
      <ToggleSeenButton
        seen={Boolean(episodeData.seen)}
        seasonId={seasonId}
        episodeNumber={episodeNumber}
      />
      <div className='flex flex-wrap sm:flex-row sm:justify-between sm:items-center'>
        <div className='flex items-center justify-center text-center w-full mb-3 space-x-3.5'>
          <Link href={`/simpsons/${prevSeason}/episode/1`} className={clsx({ 'pointer-events-none': !hasPrevSeason })}>
            <Button disabled={!hasPrevSeason} size="icon"><ChevronLeft/></Button>
          </Link>
          <p>{seasonId} Сезон</p>
          <Link href={`/simpsons/${nextSeason}/episode/1`} className={clsx({ 'pointer-events-none': !hasNextSeason })}>
            <Button disabled={!hasNextSeason} size="icon"><ChevronRight/></Button>
          </Link>
          <p>|</p>
          <Link href={`/simpsons/${seasonId}/episode/${prevEpisode}`} className={clsx({ 'pointer-events-none': !hasPrevEpisode })}>
            <Button disabled={!hasPrevEpisode} size="icon"><ChevronLeft/></Button>
          </Link>
          <p>{episodeNumber} Епізод</p>
          <Link href={`/simpsons/${seasonId}/episode/${nextEpisode}`} className={clsx({ 'pointer-events-none': !hasNextEpisode })}>
            <Button disabled={!hasNextEpisode} size="icon"><ChevronRight/></Button>
          </Link>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center'> 
        <HlsPlayer
          videoUrl={video}
          hasNextEpisode={hasNextEpisode}
          hasNextSeason={hasNextSeason}
        />
      </div>
    </div>
  )
}