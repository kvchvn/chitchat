import { LoaderCircle, type LucideProps } from 'lucide-react';

type Props = LucideProps;

export const LoadingIcon = (props: Props) => {
  return (
    <div className="animate-spin">
      <LoaderCircle {...props} />
    </div>
  );
};
