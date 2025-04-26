import db from '@/db';
import Link from 'next/link';
import HlsPlayer from '@/app/components/HlsPlayer';
export default async function({ params }: { params: Promise<{ season: string, episode: string }> }) {
  const { season, episode } = await params;

  const seasonData = db.find(({ number }) => number === season);
  const episodeData = seasonData?.episodes.find(({ number }) => Number(number) === Number(episode));
  console.log(episodeData);
  return (
    <>
      <Link href={`/simpsons`}>До сезонів</Link>
      <Link href={`/simpsons/${seasonData?.number}`}>До епізодів</Link>
      <h1>Сезон {seasonData?.number} Епізод {episodeData?.number}</h1>
      <div>
        <Link href={`/simpsons/${seasonData?.number}`}>
          <p>Назад</p>
        </Link>
      </div>
      <HlsPlayer manifest={episodeData?.video} />
      <div>
        <Link href={`/simpsons/${seasonData?.number}/episode/${Number(episode) + 1}`}>
          <p>Следующий эпизод</p>
        </Link>
      </div>
    </>
  )
}