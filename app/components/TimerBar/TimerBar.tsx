import React from "react";

interface TimerBarProps {
  timeRemaining: number;
  totalTime: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ timeRemaining, totalTime }) => {
  const percentageRemaining = (timeRemaining / totalTime) * 100;

  return (
    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden relative">
      <div
        className="h-full bg-green-500 transition-all duration-1000 ease-linear"
        style={{ width: `${percentageRemaining}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-white">{timeRemaining} seconds left</span>
      </div>
    </div>
  );
};

export default TimerBar;
