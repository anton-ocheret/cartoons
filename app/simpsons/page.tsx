import db from '@/db';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div className='flex flex-wrap gap-2'>
      {db.map(({ poster, number }) => {
        return (
          <Link  href={`/simpsons/${number}`} key={number}>
            <Image src={poster} alt="" width={256} height={269} />
            <p>{number} Сезон</p>
          </Link>
        )
      })}
    </div>
  );
}