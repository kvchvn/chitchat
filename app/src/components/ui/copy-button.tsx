'use client';

import { Clipboard, ClipboardCheck } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './button';

type Props = React.ComponentProps<typeof Button> & {
  textToCopy: string;
};

export const CopyButton = ({
  textToCopy,
  size = 'icon-sm',
  variant = 'outline',
  disabled,
  ...props
}: Props) => {
  const TIMEOUT_MS = 5000;
  const [isCopied, setIsCopied] = useState(false);

  const handleClick: React.MouseEventHandler = async (e) => {
    e.preventDefault();
    await navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, TIMEOUT_MS);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={variant}
      size={size}
      disabled={disabled || isCopied}
      {...props}>
      {isCopied ? <ClipboardCheck /> : <Clipboard />}
    </Button>
  );
};
