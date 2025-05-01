'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { SeenContext } from '@/app/components/Providers';

export function Header() {
  const { episodes, seen } = useContext(SeenContext);

  return (
    <header>
      <div className="container px-8 mx-auto xl:px-5  max-w-(--breakpoint-lg) py-5 lg:py-8 relative flex justify-between items-center">
        <Link
          href="/simpsons"
          className="py-2 text-lg font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400"
        >
          Simpsons
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400">Переглянуто {episodes} з {seen} епізодів</p>
      </div>
    </header>
  );
}