import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';

type Props = {
  id: string;
};

export const OutcomingRequestAction = ({ id }: Props) => {
  return (
    <Button variant="ghost" className="ml-auto">
      <Icon scope="global" id="close" />
      Cancel
    </Button>
  );
};
