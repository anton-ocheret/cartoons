import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold mb-4'>Сімпсони без реклами</h1>
        <Link href='/simpsons'>
          <Button>Перейти до сезонів</Button>
        </Link>
      </div>
    </main>
  );
}
export const revalidate = 2;