import Link from 'next/link';
import { ROUTES } from '~/constants/routes';
import { SuggestionsList } from './_components/suggestions-list';

export default function Suggestions() {
  return (
    <section className="col-span-2 flex h-[374px] flex-col items-start gap-6 rounded-xl border border-slate-200 p-4">
      <Link href={ROUTES.allUsers} className="link-ghost">
        <h2 className="font-title">Suggested users</h2>
      </Link>
      <SuggestionsList />
    </section>
  );
}
