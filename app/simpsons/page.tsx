import { Suspense } from 'react';
import SeasonsList from '@/app/components/SeasonsList';
import ItemsListSkeleton from '@/app/components/ItemsListSkeleton';

export default async function Page() {
  return (
    <Suspense fallback={<ItemsListSkeleton />}>
      <SeasonsList />
    </Suspense>
  );
}