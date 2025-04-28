import db from '@/db';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10'>
      {db.map(({ poster, number }) => {
        return (
          <Link  href={`/simpsons/${number}`} key={number}>
            <Image src={poster} alt="" width={256} height={269} className='rounded-lg mb-3 w-full'/>
            <h6 className='text-lg'>{number} Сезон</h6>
          </Link>
        )
      })}
    </div>
  );
}