'use client';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';

export const AuthProvidersFetchError = () => {
  const handleClick = () => {
    window.location.reload();
  };

  return (
    <>
      <p>Failed to fetch OAuth providers</p>
      <Button variant="destructive" onClick={handleClick}>
        <Icon scope="global" id="refresh" />
        Try again
      </Button>
    </>
  );
};
