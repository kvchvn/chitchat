'use client';

import React from 'react';

type Props = React.PropsWithChildren & {
  chatId: string;
};

const ChatIdContext = React.createContext('');

export const useChatId = () => React.useContext(ChatIdContext);

export const ChatIdProvider = ({ chatId, children }: Props) => {
  return <ChatIdContext.Provider value={chatId}>{children}</ChatIdContext.Provider>;
};
