import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';

type Props = {
  id: string;
};

export const IncomingRequestActions = ({ id }: Props) => {
  return (
    <div className="ml-auto flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-success-hover-light active:bg-success-active-light dark:hover:bg-success-hover-dark dark:active:bg-success-active-dark"
      >
        <Icon scope="global" id="check" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-error-hover-light active:bg-error-active-light dark:hover:bg-error-hover-dark dark:active:bg-error-active-dark"
      >
        <Icon scope="global" id="block" />
      </Button>
    </div>
  );
};
