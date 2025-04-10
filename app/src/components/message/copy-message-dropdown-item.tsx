import { Check, Clipboard } from 'lucide-react';
import { type MouseEventHandler, useState } from 'react';
import { DropdownMenuItem } from '../ui/dropdown-menu';

type Props = {
  text: string;
};

export const CopyMessageDropdownItem = ({ text }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const DELAY = 3000;

    void navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, DELAY);
    });
  };

  return (
    <DropdownMenuItem onClick={!isCopied ? handleClick : undefined}>
      {!isCopied ? <Clipboard /> : <Check />}
      {!isCopied ? 'Copy' : 'Copied'}
    </DropdownMenuItem>
  );
};
