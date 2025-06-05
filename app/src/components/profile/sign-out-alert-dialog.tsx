import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';
import { ROUTES } from '~/constants/routes';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { LoadingIcon } from '../ui/loading-icon';

type Props = React.PropsWithChildren;

export const SignOutAlertDialog = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: ROUTES.signIn });
  };

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
          <AlertDialogDescription>We will miss you</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button size="sm" disabled={isLoading} variant="outline" className="min-w-24">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            size="sm"
            disabled={isLoading}
            variant="destructive"
            className="min-w-24"
            onClick={handleClick}>
            {isLoading ? <LoadingIcon /> : <LogOut />}
            Sign out
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
