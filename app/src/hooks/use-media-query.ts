import { useEffect, useRef, useState } from 'react';
import tailwindConfig from 'tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

const resolvedTailwindConfig = resolveConfig(tailwindConfig);
const screens = resolvedTailwindConfig.theme.screens;

export const useMediaQuery = (breakpoint: keyof typeof screens) => {
  const breakpointValue = parseInt(screens[breakpoint]);

  const [screenWidth, setScreenWidth] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
    setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (timerRef.current) {
        return;
      }

      timerRef.current = setTimeout(() => {
        setScreenWidth(window.innerWidth);
        timerRef.current = null;
      }, 500);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    isClient,
    breakpointValue,
    isLessThanBreakpoint: isClient && screenWidth && screenWidth < breakpointValue,
    isMoreOrEqualThanBreakpoint: isClient && screenWidth && screenWidth >= breakpointValue,
  };
};
