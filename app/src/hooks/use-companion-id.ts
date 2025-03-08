import { usePathname } from 'next/navigation';

export const useCompanionId = () => usePathname().slice(1);
