'use client';

import { RotateCw } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const AuthProvidersFetchError = () => {
  const handleClick = () => {
    window.location.reload();
  };

  return (
    <>
      <p>Failed to fetch OAuth providers</p>
      <Button variant="destructive" onClick={handleClick}>
        <RotateCw />
        Try again
      </Button>
    </>
  );
};
