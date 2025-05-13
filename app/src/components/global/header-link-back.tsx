'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '~/constants/routes';
import { Button } from '../ui/button';

export const HeaderLinkBack = () => {
  const pathname = usePathname();

  if (!pathname.startsWith(ROUTES.profile)) {
    return null;
  }

  return (
    <Button asChild size="sm" variant="link" className="px-0">
      <Link href={ROUTES.chats}>
        <ChevronLeft className="h-4 w-4" />
        Chats
      </Link>
    </Button>
  );
};
