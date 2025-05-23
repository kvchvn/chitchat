'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Save } from 'lucide-react';
import { type Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { ROUTES } from '~/constants/routes';
import { useCheckNameUniqueness } from '~/hooks/use-check-name-uniqueness';
import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';
import { LoadingIcon } from '../ui/loading-icon';

type Props = {
  user: Session['user'];
};

type FormSchema = z.input<typeof formSchema>;

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Name must be between 4 and 30 characters' })
    .max(30, { message: 'Name must be between 4 and 30 characters' }),
});

export const AuthUsernameForm = ({ user }: Props) => {
  const form = useForm<FormSchema, unknown, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: user.name ?? '' },
    mode: 'onSubmit',
  });
  const { mutateAsync: updateUser } = api.users.updateCurrentUser.useMutation();
  const router = useRouter();

  const { isUniqueName, isChecking, checkNameUniqueness } = useCheckNameUniqueness<FormSchema>({
    form,
    inputName: 'name',
  });

  useEffect(() => {
    if (form.formState.isReady) {
      // run after the mount
      void checkNameUniqueness();
    }
  }, [form.formState.isReady, checkNameUniqueness]);

  const onSubmit: SubmitHandler<FormSchema> = async (values) => {
    const updatedUser = await updateUser({ name: values.name, hasApprovedName: true });

    if (updatedUser) {
      const route = updatedUser.isNewUser ? ROUTES.signInWelcome : ROUTES.chats;
      router.replace(route);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
        <FormField
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Name needs to be <u>unique</u> for user identification purposes
              </FormLabel>
              <FormControl>
                <Input
                  variant="primary"
                  {...field}
                  readOnly={form.formState.isSubmitting}
                  onChange={(e) => {
                    field.onChange(e);
                    void checkNameUniqueness();
                  }}
                  placeholder="Type you name"
                  withError={Boolean(fieldState.error)}
                />
              </FormControl>
              {fieldState.error ? (
                <FormMessage />
              ) : (
                <FormDescription
                  className={cn(
                    'flex h-[0.8rem] items-center gap-2',
                    isUniqueName && !isChecking && 'text-success-light dark:text-success-dark'
                  )}>
                  {isChecking ? (
                    <>
                      <LoadingIcon />
                      Checking uniqueness...
                    </>
                  ) : isUniqueName ? (
                    <>
                      <Check />
                      This name is available
                    </>
                  ) : null}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <Button
          disabled={
            !form.formState.isValid || isChecking || !isUniqueName || form.formState.isSubmitting
          }
          className="mt-8 w-fit self-end">
          {form.formState.isSubmitting ? <LoadingIcon /> : <Save />}
          Save and proceed
        </Button>
      </form>
    </Form>
  );
};
