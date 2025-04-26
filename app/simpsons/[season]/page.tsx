import db from '@/db';
import Link from 'next/link';
import Image from 'next/image';

export default async function Page({ params }: { params: Promise<{ season: string }> }) {
  const { season } = await params;
  const seasonData = db.find(({ number }) => number === season);

  return (
    <>
      <div>
        <h1>Сезон {seasonData?.number}</h1>
          <Link href={`/simpsons/${Number(seasonData?.number) - 1}`}>
            <p>Предыдущий сезон</p>
          </Link>
          <Link href={`/simpsons/${Number(seasonData?.number) + 1}`}>
            <p>Следующий сезон</p>
          </Link>
      </div>
      <div className='flex flex-wrap gap-2'>
        {
          (seasonData as any)?.episodes.length > 0 ? (
            (seasonData as any).episodes.map(({ number, poster }: { number: string, poster: string }) => {
              return (
                <Link  href={`/simpsons/${Number((seasonData as any).number)}/episode/${number}`} key={number}>
                  <Image src={poster} alt="" width={256} height={269} />
                  <p>Епизод {number}</p>
                </Link>
              )
            })
          ) : null
        }
      </div>
    </>
  )
}