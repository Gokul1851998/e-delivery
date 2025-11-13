"use client";
import React, { useEffect, useState } from "react";

interface TimerProps {
  totalTime: number; // in minutes
  handleTimeUp: (time: { minutes: number; seconds: number }) => void;
}

const Timer: React.FC<TimerProps> = ({ totalTime, handleTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(totalTime * 60);

  // Run countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        const newTime = prev > 0 ? prev - 1 : 0;
        if (newTime === 0) clearInterval(timer);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalTime]);

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
