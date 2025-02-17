import { Check, CheckCheck, Clock } from 'lucide-react';

type Props = {
  isRead: boolean;
  isSent: boolean;
};

export const MessageStatusIcon = ({ isRead, isSent }: Props) => {
  if (isRead) {
    return <CheckCheck className="h-4 w-4" />;
  }

  if (isSent) {
    return <Check className="h-4 w-4" />;
  } else {
    return <Clock className="h-4 w-4" />;
  }
};
