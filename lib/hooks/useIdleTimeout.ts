// File: lib/hooks/useIdleTimeout.ts
"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useIdleTimeout(timeout: number) {
  const router = useRouter();
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    // Prevent the timer from firing again
    if (timer.current) clearTimeout(timer.current);

    // Show a message and then log out
    alert("You have been logged out due to inactivity.");

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      router.push('/login');
      router.refresh();
    }
  };

  const resetTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(handleLogout, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    // Set the initial timer
    resetTimer();

    // Add event listeners that reset the timer on user activity
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Cleanup function to remove listeners and clear the timer
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [timeout]);

  return null;
}