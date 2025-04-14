import { CircleX, Search } from 'lucide-react';
import { type FormEventHandler, useRef } from 'react';
import { useStore } from '~/store/store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LoadingIcon } from '../ui/loading-icon';

const QUERY_DEBOUNCE_DELAY = 500;

type Props = {
  fetchSearchResult: () => void;
  areSearchResultsFetching?: boolean;
};

export const ChatSearchInput = ({ areSearchResultsFetching, fetchSearchResult }: Props) => {
  const { searchQuery, setSearchQuery, resetActiveSearchMessageId } = useStore();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClearInput = () => {
    resetActiveSearchMessageId();
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;

    resetActiveSearchMessageId();
    setSearchQuery(target.value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (target.value) {
      timerRef.current = setTimeout(() => {
        fetchSearchResult();
      }, QUERY_DEBOUNCE_DELAY);
    }
  };

  return (
    <div className="absolute top-full z-10 w-full translate-y-2 rounded-md border border-slate-300 bg-white">
      <span className="absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
        {!areSearchResultsFetching ? (
          <Search className="h-full w-full" />
        ) : (
          <LoadingIcon className="h-full w-full" />
        )}
      </span>
      <Input
        autoFocus
        ref={inputRef}
        value={searchQuery}
        onInput={handleInput}
        placeholder="Search"
        className="h-8 bg-slate-100 pl-8 pr-2 dark:bg-slate-600 sm:h-10"
      />
      {searchQuery ? (
        <Button
          onClick={handleClearInput}
          size="icon-sm"
          variant="ghost"
          className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-600">
          <CircleX strokeWidth={1.5} />
        </Button>
      ) : null}
    </div>
  );
};
