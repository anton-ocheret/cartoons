import Image from 'next/image';
import Link from 'next/link';
import { getSeasons } from '@/app/queries';
import { TogleSeenButton } from '@/app/components/ToogleSeenButton';

export default async function Page() {
  const seasons = await getSeasons();

  return (
    <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10'>
      {seasons.map(({ poster, id }) => {
        return (
          <div className='flex flex-col justify-center' key={id}>
            <Link  href={`/simpsons/${id}`} key={id}>
              <Image src={poster} alt={`Постер Сезону ${id}`} width={256} height={269} className='rounded-lg mb-3 w-full'/>
            </Link>
            <div className='flex flex-row items-center justify-between'>  
              <h6 className='text-lg'>{id} Сезон</h6>
              <TogleSeenButton
                noLabel
                seen={false}
              />
            </div>
          </div>
        )
      })}
    </div>
  );
}