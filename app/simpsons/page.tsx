import Image from 'next/image';
import Link from 'next/link';
import { getSeasons, getSeenEpisodesCount, getEpisodesCount } from '@/app/queries';
import { Eye } from 'lucide-react';
import { clsx } from 'clsx';

export default async function Page() {
  const seasons = await getSeasons();

  return (
    <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10'>
      {seasons.map(async ({ poster, id }) => {
        const seenEpisodesCount = await getSeenEpisodesCount(id);
        const episodesCount = await getEpisodesCount(id);
        return (
          <div className='flex flex-col justify-center' key={id}>
            <Link  href={`/simpsons/${id}`} key={id}>
              <Image src={poster} alt={`Постер Сезону ${id}`} width={256} height={269} className='rounded-lg mb-3 w-full'/>
            </Link>
            <div className={clsx('flex flex-row items-center justify-between', {
              'text-green-500': seenEpisodesCount === episodesCount,
            })}>  
              <h6 className='text-lg'>{id} Сезон</h6>
              <div className='flex flex-row items-center justify-between'>
                <p className='mr-2'>{seenEpisodesCount} / {episodesCount}</p>
                <Eye />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}