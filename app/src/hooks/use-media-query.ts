import { useEffect, useRef, useState } from 'react';
import tailwindConfig from 'tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

const resolvedTailwindConfig = resolveConfig(tailwindConfig);
const screens = resolvedTailwindConfig.theme.screens;

export const useMediaQuery = (breakpoint: keyof typeof screens) => {
  const breakpointValue = parseInt(screens[breakpoint]);

  const [screenWidth, setScreenWidth] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    setScreenWidth(window.innerWidth);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    isClient: Boolean(screenWidth),
    breakpointValue,
    isLessThanBreakpoint: screenWidth && screenWidth < breakpointValue,
    isMoreOrEqualThanBreakpoint: screenWidth && screenWidth >= breakpointValue,
  };
};
