import { UserRoundX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '~/constants/routes';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
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

export const RemoveAccountAlertDialog = ({ children }: Props) => {
  const { mutateAsync: removeCurrentUser, isPending } = api.users.removeCurrentUser.useMutation();
  const router = useRouter();
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      await removeCurrentUser();
      router.push(ROUTES.signIn);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Account removing failed',
        description: 'Something went wrong. Please, try again or reload the page',
      });
    }
  };

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to remove your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and removes all your data in the app including personal
            information, chats, messages etc.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button disabled={isPending} variant="outline" className="min-w-24">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            disabled={isPending}
            variant="destructive"
            className="min-w-24"
            onClick={handleClick}>
            {isPending ? <LoadingIcon /> : <UserRoundX />}
            Remove account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
