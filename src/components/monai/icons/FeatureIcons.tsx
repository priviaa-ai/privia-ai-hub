import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export const DriftDetectionIcon: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Rising line chart with anomaly dot */}
    <path
      d="M4 24L10 18L16 20L22 12L28 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Anomaly dot */}
    <circle
      cx="22"
      cy="12"
      r="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

export const LLMBehaviorIcon: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Three stacked horizontal bars */}
    <line x1="4" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4" y1="22" x2="14" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Pulse wave pattern on right */}
    <path
      d="M22 16L24 12L26 20L28 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RealTimeAlertsIcon: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Triangular warning icon */}
    <path
      d="M16 8L26 24H6L16 8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Center line in triangle */}
    <line x1="16" y1="14" x2="16" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="21" r="0.75" fill="currentColor" />
    {/* Broadcasting arcs */}
    <path
      d="M4 12C6 10 6 8 4 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M28 12C26 10 26 8 28 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const EmbeddingDriftIcon: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Four dots in grid - top-right shifted upward */}
    <circle cx="11" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="21" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="11" cy="22" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="21" cy="22" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Subtle drift indicator line */}
    <path
      d="M21 11.5L21 19.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeDasharray="2 2"
      opacity="0.5"
    />
  </svg>
);
