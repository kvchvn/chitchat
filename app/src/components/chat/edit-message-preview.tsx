import { PencilLine, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useStore } from '~/store/store';

export const EditMessagePreview = () => {
  const setMessageToEdit = useStore.use.setMessageToEdit();
  const messageToEdit = useStore.use.messageToEdit();

  const handleClick = () => {
    setMessageToEdit(null);
  };

  if (!messageToEdit) {
    return null;
  }

  return (
    <div className="sticky bottom-0 z-[4] flex w-full items-center gap-2 rounded-t-md bg-slate-200 p-2 dark:bg-slate-800">
      <PencilLine className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
      <p className="overflow-hidden text-ellipsis whitespace-nowrap">{messageToEdit.text}</p>
      <Button onClick={handleClick} size="icon-xs" variant="ghost" className="ml-auto">
        <X />
      </Button>
    </div>
  );
};
