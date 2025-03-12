'use client';

import React from 'react';

type Props = React.PropsWithChildren & {
  userId: string;
};

const UserIdContext = React.createContext('');

export const useUserId = () => React.useContext(UserIdContext);

export const UserIdProvider = ({ userId, children }: Props) => {
  return <UserIdContext.Provider value={userId}>{children}</UserIdContext.Provider>;
};
