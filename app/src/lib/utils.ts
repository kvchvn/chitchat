import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getNameInitials = (name: string | undefined | null) => {
  if (!name) {
    return 'U';
  }

  const [firstName, lastName] = name.split(' ');

  const firstLetter = firstName?.slice(0, 1).toUpperCase() ?? '';
  const secondLetter = lastName?.slice(0, 1).toUpperCase() ?? '';

  // U means user
  return !firstLetter && !secondLetter ? 'U' : `${firstLetter}${secondLetter}`;
};
