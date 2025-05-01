'use client';

import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';

import { Button } from "@/components/ui/button";
import { togleSeenAction } from '../queries';
import { useState, useContext } from 'react';
import { SeenContext } from '@/app/components/Providers';

export function ToggleSeenButton(props: {
  seen: boolean,
  seasonId?: string,
  episodeNumber?: string,
  noLabel?: boolean,
  disabled?: boolean,
  onToggle?: () => void,
}) {
  const {
    noLabel = false,
  } = props;
  const [seen, setSeen] = useState(props.seen);
  const { fetchSeenInformation } = useContext(SeenContext);

  const Icon = seen ? <Eye /> : <EyeOff />;
  const text = seen ? 'Відзначити як не переглянуто' : 'Відзначити як переглянуто';

  const disabled = !props.seasonId || !props.episodeNumber || props.disabled;
  const toggleSeen = async () => {
    const formData = new FormData();
    formData.append('seasonId', String(props.seasonId));
    formData.append('episodeNumber', String(props.episodeNumber));

    await togleSeenAction(formData);
    setSeen((prevSeen) => !prevSeen);
    fetchSeenInformation();
  }
  return (
    <div className='flex flex-row items-center'>
      <Button
        type="submit"
        size="icon"
        className={clsx('mr-2', {
          'bg-green-500 hover:bg-green-600': seen,
          'opacity-80!': disabled,
        })}
        disabled={disabled}
        onClick={toggleSeen}
      >
        {Icon}
      </Button>
      {!noLabel && text}
    </div>
  )
}