'use client';

import { ImageUp } from 'lucide-react';
import { getNameInitials } from '~/lib/utils';
import { api } from '~/trpc/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const ProfilePromoAvatar = () => {
  const { data: user } = api.users.getCurrent.useQuery();

  const nameInitials = getNameInitials(user?.name);

  return (
    <Avatar className="group absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 translate-y-1/2 border-8 border-background-light dark:border-background-dark lg:left-[unset] lg:h-36 lg:w-36 lg:translate-x-0 lg:translate-y-8">
      <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'Avatar'} />
      <AvatarFallback className="text-4xl tracking-wider">{nameInitials}</AvatarFallback>
      <span className="absolute h-full w-full transition-[backdrop-filter] duration-200 lg:group-hover:backdrop-blur-md">
        <label className="lg:animate-avatar-upload-btn-bounce absolute left-0 top-3/4 z-2 h-1/2 w-full cursor-pointer backdrop-blur-lg transition-[top,background-color] group-hover:animate-none group-hover:duration-300 lg:top-full lg:bg-slate-300 lg:backdrop-blur-none lg:hover:bg-slate-400 lg:group-hover:top-1/2 lg:dark:bg-slate-800 lg:dark:hover:bg-slate-700">
          <input type="file" hidden />
          <ImageUp className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-8 scale-75 transition-[transform] lg:h-6 lg:w-6 lg:group-hover:-translate-y-1/2 lg:group-hover:scale-100" />
        </label>
      </span>
    </Avatar>
  );
};
