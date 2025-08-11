import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  return (
    <div
      className={`flex w-full h-4 items-center shrink-0 absolute bg-slate-700 left-0 top-0 ${className}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${progress}% complete`}
    >
      <div
        className="h-4 shrink-0 absolute bg-[#EED4F0] left-0 top-0 transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
