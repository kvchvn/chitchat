import { api } from '~/trpc/react';
import { useToast } from '../use-toast';

export const useUpdateUserOptimisticMutation = () => {
  const utils = api.useUtils();
  const { toast } = useToast();

  return api.users.updateCurrentUser.useMutation({
    onMutate: async (newUserData) => {
      await utils.users.getCurrent.cancel();

      const previousUser = utils.users.getCurrent.getData();

      utils.users.getCurrent.setData(undefined, (staleUser) => {
        if (staleUser) {
          return { ...staleUser, ...newUserData };
        }

        return staleUser;
      });

      return { previousUser };
    },
    onError: (_, __, ctx) => {
      utils.users.getCurrent.setData(undefined, ctx?.previousUser);

      toast({
        variant: 'destructive',
        title: 'Updating the user data failed',
        description: 'Something went wrong. Please try again later',
      });
    },
    onSettled: async () => {
      await utils.users.getCurrent.invalidate();
    },
  });
};
