import db from '@/db';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default async function Page({ params }: { params: Promise<{ season: string }> }) {
  const { season } = await params;
  const seasonData = db.find(({ number }) => number === season);
  const seasonsCount = db.length;
  const hasNextSeason = Number(season) < seasonsCount;
  const nextSeason = Number(season) + 1;
  const hasPrevSeason = Number(season) > 1;
  const prevSeason = Number(season) - 1;
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

  return (
    <>
      <div className='flex justify-between mb-5 items-center relative'>
        <div>
          {
            hasPrevSeason && (
              <Link href={`/simpsons/${prevSeason}`}>
                <Button>Попередній сезон</Button>
              </Link>
            )
          }
        </div>
        <p className='absolute left-1/2 -translate-x-1/2'>{season} Сезон</p>
        <div>
          {
            hasNextSeason && (
              <Link href={`/simpsons/${nextSeason}`}>
                <Button>Наступний сезон</Button>
              </Link>
            )
          }
        </div>
      </div>
      <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-10'>
        {episodes.map(({ poster, number }) => {
          return (
            <Link  href={`/simpsons/${Number(seasonData.number)}/episode/${Number(number)}`} key={number}>
              <Image src={poster} alt="" width={256} height={269} className='rounded-lg mb-3'/>
              <h6 className='text-lg'>{number} Епізод</h6>
            </Link>
          )
        })}
      </div>
    </>
  )
}