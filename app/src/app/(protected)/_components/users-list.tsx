import React from 'react';

export const UsersList = ({ children }: React.PropsWithChildren) => {
  return <ul className="flex flex-col gap-3">{children}</ul>;
};
