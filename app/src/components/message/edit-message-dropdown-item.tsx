import { PencilLine } from 'lucide-react';
import { DropdownMenuItem } from '~/components/ui/dropdown-menu';
import { type ChatMessage } from '~/server/db/schema/messages';
import { useStore } from '~/store/store';

type Props = {
  message: ChatMessage;
};

export const EditMessageDropdownItem = ({ message }: Props) => {
  const setMessageToEdit = useStore.use.setMessageToEdit();

  const handleClick = () => {
    setMessageToEdit(message);
  };

  return (
    <DropdownMenuItem onClick={handleClick}>
      <PencilLine />
      Edit
    </DropdownMenuItem>
  );
};
