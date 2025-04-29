import Image from 'next/image';
import Link from 'next/link';
import { getSeasonsPageData } from '@/app/queries';
import { Eye } from 'lucide-react';
import { clsx } from 'clsx';

export default async function Page() {
  const seasonPageData = await getSeasonsPageData();

  return (
    <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10'>
      {seasonPageData.map(async ({ poster, season_id, seen_episodes, total_episodes }) => {
        return (
          <div className='flex flex-col justify-center' key={season_id}>
            <Link  href={`/simpsons/${season_id}`} key={season_id}>
              <Image src={poster} alt={`Постер Сезону ${season_id}`} width={256} height={269} className='rounded-lg mb-3 w-full'/>
            </Link>
            <div className={clsx('flex flex-row items-center justify-between', {
              'text-green-500': seen_episodes === total_episodes,
            })}>  
              <h6 className='text-lg'>{season_id} Сезон</h6>
              <div className='flex flex-row items-center justify-between'>
                <p className='mr-2'>{seen_episodes} / {total_episodes}</p>
                <Eye />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}