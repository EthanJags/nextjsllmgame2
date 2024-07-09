import React from "react";
import styles from "./TimerBar.module.css";

interface TimerBarProps {
  timeRemaining: number;
  totalTime: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ timeRemaining, totalTime }) => {
  const percentageRemaining = (timeRemaining / totalTime) * 100;

  return (
    <div className={styles.timerBarContainer}>
      <div
        className={styles.timerBar}
        style={{ width: `${percentageRemaining}%` }}
      />
      <h1>{timeRemaining} seconds left</h1>
    </div>
  );
};

export default TimerBar;
