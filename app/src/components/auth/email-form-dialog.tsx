import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { signIn } from 'next-auth/react';
import React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { env } from '~/env';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { LoadingIcon } from '../ui/loading-icon';

const formSchema = z.object({
  email: z.string().email({ message: "It's not a valid email" }),
});

type FormSchema = z.input<typeof formSchema>;

export const EmailFormDialog = React.forwardRef<HTMLButtonElement | null>(({}, triggerRef) => {
  const form = useForm<FormSchema, unknown, z.output<typeof formSchema>>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = async ({ email }) => {
    await signIn('email', { email });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger ref={triggerRef} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter your email</AlertDialogTitle>
          <AlertDialogDescription>
            Please, enter an email you want to be signed in with.
            <br />
            You will receive a confirmation link from <Badge>{env.NEXT_PUBLIC_EMAIL_FROM}</Badge>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      variant="primary"
                      withError={Boolean(fieldState.error)}
                      placeholder="Your email"
                    />
                  </FormControl>
                  <div className="h-[0.8rem]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={form.formState.isSubmitting}>
                  Sign in with another provider
                </Button>
              </AlertDialogCancel>
              <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <LoadingIcon /> : <Send />}
                Send the link
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
});

EmailFormDialog.displayName = 'EmailFormDialog';
