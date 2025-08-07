import { MailCheck } from 'lucide-react';

export default async function SignInVerifyRequest() {
  return (
    <>
      <MailCheck className="h-24 w-24" strokeWidth={1} />
      <h2>Your sign-in link has been sent</h2>
      <div className="px-4">
        <p>
          Please, check your inbox or spam{' '}
          <span className="text-slate-400">(in some cases mails could be trapped there)</span>
        </p>
        <p className="mt-2">
          The link will be valid within{' '}
          <span className="text-highlight-light dark:text-highlight-dark">24 hours</span>
        </p>
        <p className="mt-4 text-sm text-slate-400 dark:text-slate-400">
          You can close this page without worry
        </p>
      </div>
    </>
  );
}
