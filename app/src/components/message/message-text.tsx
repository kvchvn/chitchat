import { memo } from 'react';

type Props = {
  text: string;
  searchQuery: string;
  isActiveSearchMessage: boolean;
};

const MessageText = ({ text, searchQuery, isActiveSearchMessage }: Props) => {
  if (!searchQuery || !isActiveSearchMessage) {
    return <span className="px-5">{text}</span>;
  }

  const regex = new RegExp(`(${searchQuery})`, 'gi');
  return (
    <span className="px-5">
      {text.split(regex).map((part, i) =>
        regex.test(part) ? (
          <mark className="bg-primary-active-light dark:bg-primary-active-dark" key={i}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export const MessageTextMemo = memo(MessageText);
