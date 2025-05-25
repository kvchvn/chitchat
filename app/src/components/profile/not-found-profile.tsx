'use client';

import { ArrowLeft, RotateCcw, Squirrel } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '~/constants/routes';
import { Button } from '../ui/button';

export const NotFoundProfile = () => {
  const router = useRouter();

  return (
    <div className="mx-auto flex flex-col items-center gap-2">
      <Squirrel className="h-20 w-20 md:h-32 md:w-32" strokeWidth={1} />
      <p>Your profile information could not be found :(</p>
      <p>Try to reload the page or visit it later</p>
      <div className="mt-4 flex gap-2">
        <Button
          onClick={() => {
            router.refresh();
          }}>
          <RotateCcw className="h-4 w-4" />
          Reload
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.chats}>
            <ArrowLeft className="h-4 w-4" />
            Return to chats
          </Link>
        </Button>
      </div>
    </div>
  );
};
