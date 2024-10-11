'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { ROUTES } from '~/constants/routes';

const DURATION = 5000;

export const WelcomeConfetti = () => {
  const pathname = usePathname();
  const [confettiSizes, setConfettiSizes] = useState({ width: 0, height: 0 });
  const [isPlaying, setIsPlaying] = useState(true);

  const isWelcomePage = pathname === ROUTES.signInWelcome;

  useEffect(() => {
    let timerId = null;

    if (isWelcomePage) {
      timerId = setTimeout(() => {
        // stop confetti
        setIsPlaying(false);
      }, DURATION);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isWelcomePage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setConfettiSizes({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  if (!isWelcomePage) {
    return null;
  }

  return (
    <Confetti
      width={confettiSizes.width}
      height={confettiSizes.height}
      numberOfPieces={400}
      recycle={isPlaying}
      className="!z-0"
    />
  );
};
