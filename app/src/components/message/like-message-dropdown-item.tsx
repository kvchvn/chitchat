import { Heart } from 'lucide-react';
import { DropdownMenuItem } from '~/components/ui/dropdown-menu';

export const LikeMessageDropdownItem = () => {
  return (
    <DropdownMenuItem>
      <Heart />
      Like
    </DropdownMenuItem>
  );
};
