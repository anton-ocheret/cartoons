import db from '@/db';
import Image from 'next/image';
import Link from 'next/link';
import { getSeasons } from '@/app/queries';

export default async function Page() {
  const seasons = await getSeasons();

  console.log(seasons);
  return (
    <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10'>
      {seasons.map(({ poster, id }) => {
        return (
          <Link  href={`/simpsons/${id}`} key={id}>
            <Image src={poster} alt={`Постер Сезону ${id}`} width={256} height={269} className='rounded-lg mb-3 w-full'/>
            <h6 className='text-lg'>{id} Сезон</h6>
          </Link>
        )
      })}
    </div>
  );
}