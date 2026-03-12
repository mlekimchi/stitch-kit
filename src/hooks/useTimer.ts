import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';

export function useTimer() {
  const { timer, timerTick } = useStore(s => ({
    timer: s.timer,
    timerTick: s.timerTick,
  }));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => timerTick(), 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer.isRunning, timerTick]);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, []);

  const getRate = useCallback(() => {
    const completedLaps = timer.laps.length;
    if (completedLaps < 2 || timer.elapsed < 1000) return null;
    const msPerRow = timer.elapsed / completedLaps;
    const minPerRow = msPerRow / 60000;
    const rowsPerHour = 3600000 / msPerRow;
    return { minPerRow, rowsPerHour };
  }, [timer.laps, timer.elapsed]);

  return { timer, formatTime, getRate };
}
