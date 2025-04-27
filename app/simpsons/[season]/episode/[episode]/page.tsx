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
      <div className='flex justify-between mb-5 items-center relative'>
        <div>
          {
            hasPrevSeason && (
              <Link href={`/simpsons/${prevSeason}/episode/1`} className='mr-2'>
                <Button>Попередній сезон</Button>
              </Link>
            )
          }
          {
            hasPrevEpisode && (
              <Link href={`/simpsons/${seasonData.number}/episode/${prevEpisode}`}>
                <Button>Попередній eпізод</Button>
              </Link>
            )
          }
        </div>
        <p className='absolute left-1/2 -translate-x-1/2'>{season} Сезон | {episode} Епізод</p>
        <div>
          {
            hasNextEpisode && (
              <Link href={`/simpsons/${seasonData.number}/episode/${nextEpisode}`}>
                <Button>Наступний епізод</Button>
              </Link>
            )
          }
          {
            hasNextSeason && (
              <Link href={`/simpsons/${nextSeason}/episode/1`} className='ml-2'>
                <Button>Наступний сезон</Button>
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