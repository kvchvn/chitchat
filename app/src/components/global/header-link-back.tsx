'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '~/constants/routes';
import { Button } from '../ui/button';

export const HeaderLinkBack = () => {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname !== ROUTES.profile) {
    return null;
  }

  const handleClick = () => {
    router.back();
  };

  return (
    <Button size="sm" variant="ghost" onClick={handleClick} className="px-0">
      <ChevronLeft className="h-4 w-4" />
      Back
    </Button>
  );
};
