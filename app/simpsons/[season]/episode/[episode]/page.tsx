import db from '@/db';
import Link from 'next/link';
import HlsPlayer from '@/app/components/HlsPlayer';
import { Button } from '@/components/ui/button';

export default async function Page({ params }: { params: Promise<{ season: string, episode: string }> }) {
  const { season, episode } = await params;

  const seasonData = db.find(({ number }) => number === season);

  if (!seasonData) {
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

  const episodes = seasonData.episodes || [];

  const hasPrevEpisode = Number(episode) > 1;
  const prevEpisode = Number(episode) - 1;
  const hasNextEpisode = Number(episode) < (episodes.length || 0);
  const nextEpisode = Number(episode) + 1;
  const episodeData = episodes.find(({ number }) => Number(number) === Number(episode));

  if (!episodeData) {
    return (
      <>
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-2xl font-bold mb-4'>Епізод не найден</p>
          <Link href={`/simpsons/${seasonData.number}`}>  
            <Button>До епізодів {season} сезону</Button>
          </Link>
        </div>
      </>
    );
  }

  const seasonsCount = db.length;
  const hasNextSeason = Number(season) < seasonsCount;
  const nextSeason = Number(season) + 1;
  const hasPrevSeason = Number(season) > 1;
  const prevSeason = Number(season) - 1;
  
  return (
    <div>
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
        <p className='flex-shrink-0 text-center w-full m-2 order-1 sm:w-auto'>{season} Сезон | {episode} Епізод</p>
        <div className='flex w-full justify-center order-3 sm:w-auto'>
          {
            hasPrevEpisode && (
              <Link href={`/simpsons/${seasonData.number}/episode/${prevEpisode}`} className='m-2 last:sm:mr-0'>
                <Button>Попередній eпізод</Button>
              </Link>
            )
          }
          {
            hasNextEpisode && (
              <Link href={`/simpsons/${seasonData.number}/episode/${nextEpisode}`} className='m-2 last:sm:mr-0'>
                <Button>Наступний епізод</Button>
              </Link>
            )
          }
        </div>
      </div>
      <div className='flex flex-col items-center justify-center'>  
        <HlsPlayer
          hasNextEpisode={hasNextEpisode}
          hasNextSeason={hasNextSeason}
          videoUrl={episodeData?.video || ''}
        />
      </div>
    </div>
  )
}