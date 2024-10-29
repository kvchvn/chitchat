import { clsx, type ClassValue } from 'clsx';
import { type User } from 'next-auth';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// for user's avatar
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

// for showing slice of friends/requests on the page
export const getUsersSlice = ({
  users,
  page,
  perPage,
}: {
  users: Pick<User, 'id' | 'name' | 'image'>[];
  page: number;
  perPage: number;
}) => {
  return users.length > perPage + 1 ? users.slice(perPage * (page - 1), perPage * page) : users;
};
