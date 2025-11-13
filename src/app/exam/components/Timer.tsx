"use client";
import React, { useEffect, useState } from "react";

interface TimerProps {
  totalTime: number; // in minutes
  handleTimeUp: (time: { minutes: number; seconds: number }) => void;
}

const Timer: React.FC<TimerProps> = ({ totalTime, handleTimeUp }) => {
  // Coerce totalTime to a safe integer (minutes)
  const minutesTotal = Number.isFinite(totalTime) ? Math.max(0, Math.floor(totalTime)) : 0;

  const [secondsLeft, setSecondsLeft] = useState(() => minutesTotal * 60);

  // Run countdown
  useEffect(() => {
    // Reset seconds when totalTime changes
    setSecondsLeft(minutesTotal * 60);

    // if no time, don't start the interval
    if (minutesTotal <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [minutesTotal]);

  // Notify parent whenever time updates (AFTER render)
  useEffect(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    handleTimeUp({ minutes, seconds });
  }, [secondsLeft, handleTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium">
      ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default Timer;
