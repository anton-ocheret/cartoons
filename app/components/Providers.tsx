'use client';
import { createContext, useState } from 'react';

export const SeenContext = createContext({
  episodes: '0',
  seen: '0',
  fetchSeenInformation: () => {},
});

export function Providers({ children, value }: { children: React.ReactNode, value: { episodes: string, seen: string } }) {
  const [seen, setSeen] = useState(value.seen);

  const fetchSeenInformation = async () => {
    const response = await fetch('/api/seen');
    const data = await response.json();
    setSeen(data.seen);
  }

  const initialValue = {
    episodes: value.episodes,
    seen,
    fetchSeenInformation,
  }
  return (
    <SeenContext.Provider value={initialValue}>
      {children}
    </SeenContext.Provider>
  );
}