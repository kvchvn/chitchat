'use client';

import React, { useState } from 'react';
import { api } from '~/trpc/react';

export const Form = () => {
  const [value, setValue] = useState('');
  const utils = api.useUtils();
  const mutation = api.message.create.useMutation({
    async onSuccess() {
      await utils.message.invalidate();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClick = async () => {
    if (value) {
      mutation.mutate({ text: value });
      setValue('');
    }
  };
s
  return (
    <div>
      <input
        type="text"
        value={value}
        disabled={mutation.isPending}
        onChange={handleChange}
        className="border border-l-sky-600"
      />
      <button onClick={handleClick} disabled={mutation.isPending} className="bg-orange-300">
        Send!
      </button>
      {mutation.isSuccess && <span className="text-green-600">Sent...</span>}
    </div>
  );
};
