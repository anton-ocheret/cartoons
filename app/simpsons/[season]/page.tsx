import db from '@/db';
import Link from 'next/link';
import Image from 'next/image';

export default async function({ params }: { params: { season: string } }) {
  const { season } = await params;
  console.log(season);
  const seasonData = db.find(({ number }) => number === season);
  console.log(seasonData.episodes);
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
          seasonData?.episodes.length > 0 ? (
            seasonData.episodes.map(({ number, poster }) => {
              return (
                <Link  href={`/simpsons/${Number(seasonData.number)}/episode/${number}`} key={number}>
                  <Image src={poster} alt="" width={256} height={269} />
                  <p>Епизод {number}</p>
                </Link>
              )
            })
          ) : null
        }
        {/* {seasonData.episodes.map(({ number, poster }) => {
          <Link  href={`/simpsons/${seasonData.number}/episode/${number}`} key={number}>
            <Image src={poster} alt="" width={256} height={269} />
            <p>Епизод {number}</p>
          </Link>
        })} */}
      </div>
    </>
  )
}