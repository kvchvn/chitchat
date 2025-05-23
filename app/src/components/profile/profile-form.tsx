'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Ban, PencilLine, Save } from 'lucide-react';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUpdateUserOptimisticMutation } from '~/hooks/mutations/use-update-user-optimistic-mutation';
import { useCheckNameUniqueness } from '~/hooks/use-check-name-uniqueness';
import { type User } from '~/server/db/schema/users';
import { Button } from '../ui/button';
import { CopyButton } from '../ui/copy-button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { LoadingIcon } from '../ui/loading-icon';

type Props = {
  user: User;
};

type FormSchema = z.input<typeof formSchema>;

type FormField = {
  name: keyof FormSchema;
  labelText: string;
  descriptionText: string;
  placeholder?: string;
  readOnly?: boolean;
};

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Name must be between 4 and 30 characters' })
    .max(30, { message: 'Name must be between 4 and 30 characters' }),
  email: z.string().email({ message: "It's not a valid email" }),
  id: z.string().min(1),
});

export const PROFILE_FORM_FIELDS: FormField[] = [
  {
    name: 'name',
    labelText: 'Your name',
    placeholder: 'Enter your name',
    descriptionText: 'Name needs to be unique. This is how other users can recognize you',
  },
  {
    name: 'id',
    labelText: 'Your ID',
    descriptionText: `You can use this ID to share link to your chat with somebody, i.e. https://<current-url>/<ID>`,
    readOnly: true,
  },
  {
    name: 'email',
    labelText: 'You email',
    descriptionText: 'Email is used during the first authorization',
    readOnly: true,
  },
] as const;

export const ProfileForm = ({ user }: Props) => {
  const form = useForm<FormSchema, unknown, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: user.name, id: user.id, email: user.email },
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const { isChecking, checkNameUniqueness } = useCheckNameUniqueness({
    form,
    inputName: 'name',
  });
  const { mutateAsync: updateUser, isPending } = useUpdateUserOptimisticMutation();

  const toggleEditMode = () => {
    if (isEditMode) {
      form.reset({ name: user.name, id: user.id, email: user.email });
    }

    setIsEditMode(!isEditMode);
  };

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    await updateUser({ name: data.name });
    setIsEditMode(false);
  };

  return (
    <section className="grid h-fit w-full gap-8 lg:grid-cols-2">
      <div className="relative flex flex-col gap-1 border-slate-200 pb-8 after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-1/3 after:-translate-x-1/2 after:bg-slate-200 lg:border-r lg:pb-0 lg:pr-8 lg:after:content-none">
        <p>You can update some of your personal information.</p>
        <p>
          However, certain details cannot be modified — they are required to remain consistent for
          secure and uninterrupted authorization.
        </p>
        <p className="mt-2">At least for now...</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full grid-cols-1 gap-4">
          {PROFILE_FORM_FIELDS.map((formField) => (
            <FormField
              key={formField.name}
              control={form.control}
              name={formField.name}
              render={({ field, fieldState }) => {
                const isReadOnly = formField.readOnly ?? !isEditMode;

                return (
                  <FormItem>
                    <FormLabel>{formField.labelText}</FormLabel>
                    <div className="group relative">
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            void checkNameUniqueness();
                          }}
                          placeholder={formField.placeholder}
                          variant="primary"
                          readOnly={isReadOnly}
                          withError={Boolean(fieldState.error)}
                          className="pr-11"
                          postfix={
                            isReadOnly ? (
                              <CopyButton
                                variant="outline"
                                textToCopy={field.value}
                                className="absolute right-1 top-1/2 -translate-y-1/2 md:invisible md:group-hover:visible"
                              />
                            ) : undefined
                          }
                        />
                      </FormControl>
                    </div>
                    {fieldState.error ? (
                      <FormMessage />
                    ) : (
                      <FormDescription className="flex max-h-[0.8rem] items-center gap-2">
                        {field.name === 'name' && isChecking ? (
                          <>
                            <LoadingIcon className="h-4 w-4" />
                            Checking uniqueness...
                          </>
                        ) : (
                          formField.descriptionText
                        )}
                      </FormDescription>
                    )}
                  </FormItem>
                );
              }}
            />
          ))}
          <div className="col-start-1 mt-4 flex flex-col-reverse gap-4 xs:flex-row">
            <Button
              type="button"
              variant={isEditMode ? 'outline' : 'default'}
              className="w-full xs:w-[300px] xs:max-w-[50%]"
              onClick={toggleEditMode}>
              {isEditMode ? <Ban /> : <PencilLine />}
              {isEditMode ? 'Cancel' : 'Edit'}
            </Button>
            {isEditMode && form.formState.isDirty ? (
              <Button
                type="submit"
                disabled={Boolean(Object.keys(form.formState.errors).length)}
                className="w-full xs:w-[300px] xs:max-w-[50%]">
                {isPending ? <LoadingIcon /> : <Save />}
                Save
              </Button>
            ) : null}
          </div>
        </form>
      </Form>
    </section>
  );
};
