import React from 'react';
import styles from './ProgressRing.module.css';

interface ProgressRingProps {
  completed: number;
  total: number;
}

export default function ProgressRing({ completed, total }: ProgressRingProps) {
  const radius = 35;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const safeTotal = total > 0 ? total : 1;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  let message = "Let's get started on your tasks today!";
  if (total === 0) {
    message = "No tasks yet. Create one to begin!";
  } else if (percent > 0 && percent < 50) {
    message = "Getting started is the hardest part. Keep going!";
  } else if (percent >= 50 && percent < 100) {
    message = "You're making great progress! Keep it up!";
  } else if (percent === 100 && total > 0) {
    message = "Incredible! You've crushed all your tasks! 🎉";
  }

  return (
    <div className={styles.container}>
      <div className={styles.ringWrapper}>
        <svg
          height={radius * 2}
          width={radius * 2}
        >
          {/* Background Ring */}
          <circle
            stroke="var(--glass-border)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Ring */}
          <circle
            stroke="var(--primary)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
          {/* Inner Icon / Text */}
          <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            className={styles.percentText}
            fill="var(--text-main)"
          >
            {percent}%
          </text>
        </svg>
      </div>
      <div className={styles.textContainer}>
        <div className={styles.goalText}>
          Goal Progress: <span style={{ fontWeight: 'bold' }}>{completed}/{total} tasks</span>
        </div>
        <div className={styles.messageText}>{message}</div>
      </div>
    </div>
  );
}
