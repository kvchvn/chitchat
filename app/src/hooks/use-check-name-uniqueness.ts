import { useCallback, useRef } from 'react';
import { type Path, type useForm } from 'react-hook-form';
import { api } from '~/trpc/react';

interface UseCheckNameUniquenessArgs<FormSchema extends Record<string, string>> {
  form: ReturnType<typeof useForm<FormSchema>>;
  inputName: Path<FormSchema>;
}

export const useCheckNameUniqueness = <FormSchema extends Record<string, string>>({
  form,
  inputName,
}: UseCheckNameUniquenessArgs<FormSchema>) => {
  const ERROR_MESSAGE = 'The entered name is already taken';
  const TIMEOUT_MS = 500;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: check,
    isFetching: isChecking,
    refetch: checkNameUniqueness,
  } = api.users.checkNameUniqueness.useQuery(
    { name: form.getValues(inputName).trim().toLowerCase() },
    {
      enabled: false,
    }
  );

  const runChecking = useCallback(async () => {
    if (!form.getValues(inputName)) {
      return;
    }

    form.clearErrors(inputName);
    const isValid = await form.trigger();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      if (isValid) {
        const res = await checkNameUniqueness();

        if (res.data && !res.data.isUniqueName) {
          form.setError(inputName, { message: ERROR_MESSAGE });
        }
      }
    }, TIMEOUT_MS);
  }, [checkNameUniqueness, form, inputName]);

  return {
    isUniqueName: Boolean(check?.isUniqueName),
    isChecking,
    checkNameUniqueness: runChecking,
  };
};
