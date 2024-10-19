import { Icon } from '~/components/ui/icon';
import { Input } from '~/components/ui/input';

export const FriendsSearch = () => {
  return (
    <label className="relative w-full">
      <Input placeholder="Search..." />
      <Icon
        scope="global"
        id="search"
        className="absolute right-2 top-[50%] h-6 w-6 -translate-y-[50%] bg-background-light p-1 dark:bg-background-dark"
      />
    </label>
  );
};
