import { MailCheck } from 'lucide-react';

export default async function SignInVerifyRequest() {
  return (
    <>
      <MailCheck className="h-24 w-24" strokeWidth={1} />
      <h2>Your sign-in link has been sent</h2>
      <div className="px-4">
        <p>Please, check your inbox.</p>
        <p>
          The link will be valid within{' '}
          <span className="text-highlight-light dark:text-highlight-dark">24 hours</span>
        </p>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          You can close this page without worry
        </p>
      </div>
    </>
  );
}
