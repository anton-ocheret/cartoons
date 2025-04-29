import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';

import { Button } from "@/components/ui/button";
import { togleSeenAction } from '../queries';

export function TogleSeenButton(props: { seen: boolean, seasonId: string, episodeNumber: string }) {
  const Icon = props.seen ? <Eye /> : <EyeOff />;
  const text = props.seen ? 'Відзначити як не переглянуто' : 'Відзначити як переглянуто';

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
          })}
        >
          {Icon}
        </Button>
        {text}
      </form>
    </>
  )
}