import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';

type Props = {
  id: string;
};

export const SuggestionAction = ({ id }: Props) => {
  return (
    <Button variant="ghost" className="ml-auto">
      <Icon scope="friends" id="add-friend" />
      Add to friends
    </Button>
  );
};
