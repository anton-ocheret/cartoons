import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ToggleSeenButton } from '@/app/components/ToogleSeenButton';

import { getEpisodes } from '@/app/queries';

export default async function EpisodesList({ seasonId }: { seasonId: number }) {
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

  return (
    <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10'>
      {episodes.map(({ number, season_id, seen }) => {
        return (
          <div className='flex flex-col justify-center' key={number}>
            <Link  href={`/simpsons/${Number(season_id)}/episode/${Number(number)}`} key={number}>
              <Image
                src={`https://simpsons-images.s3.eu-north-1.amazonaws.com/optimized_images/${season_id}x${number}.webp`}
                alt=""
                width={165}
                height={112}
                className='rounded-lg mb-3 w-full'
              />
            </Link>
            <div className='flex flex-row items-center justify-between'>
              <h6 className='text-lg'>{number} Епізод</h6>
              <ToggleSeenButton
                noLabel
                seen={seen}
                seasonId={seasonId.toString()}
                episodeNumber={number.toString()}
              />
            </div>
          </div>
        )
      })}
    </div>
  );
}