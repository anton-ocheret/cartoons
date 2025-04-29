import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';

import { Button } from "@/components/ui/button";
import { togleSeenAction } from '../queries';

export function TogleSeenButton(props: {
  seen: boolean,
  seasonId?: string,
  episodeNumber?: string,
  noLabel?: boolean,
  className?: string,
  disabled?: boolean,
}) {
  const {
    noLabel = false,
  } = props;
  const Icon = props.seen ? <Eye /> : <EyeOff />;
  const text = props.seen ? 'Відзначити як не переглянуто' : 'Відзначити як переглянуто';
  const disabled = !props.seasonId || !props.episodeNumber || props.disabled;
  return (
    <>
      <form action={togleSeenAction} className='flex flex-row items-center'>
        <input type="hidden" name="seasonId" value={props.seasonId} />
        <input type="hidden" name="episodeNumber" value={props.episodeNumber} />

        <Button
          type="submit"
          size="icon"
          className={clsx('mr-2', {
            'bg-green-500 hover:bg-green-600': props.seen,
            'opacity-80!': disabled,
          })}
          disabled={disabled}
        >
          {Icon}
        </Button>
        {!noLabel && text}
      </form>
    </>
  )
}