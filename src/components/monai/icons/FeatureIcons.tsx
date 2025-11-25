import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// Feature Icons

export const DriftDetectionIcon: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Three rising bars */}
    <rect x="5" y="20" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <rect x="14" y="14" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <rect x="23" y="8" width="4" height="20" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none" />
    {/* Overlaid wave line indicating anomaly */}
    <path
      d="M3 18C6 18 8 12 11 12C14 12 16 16 19 16C22 16 24 10 27 10"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.7"
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
    {/* Neural network nodes - 5 circles connected */}
    {/* Top layer - 2 nodes */}
    <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <circle cx="22" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
    {/* Middle layer - 1 node */}
    <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
    {/* Bottom layer - 2 nodes */}
    <circle cx="10" cy="24" r="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <circle cx="22" cy="24" r="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
    {/* Connections */}
    <line x1="12" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="20" y1="10" x2="18" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="14" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="18" y1="18" x2="20" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
    {/* Premium bell outline */}
    <path
      d="M16 4C16 4 12 4 10 8C8 12 8 16 8 18L6 22H26L24 18C24 16 24 12 22 8C20 4 16 4 16 4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Bell clapper */}
    <path
      d="M13 22C13 24 14.5 26 16 26C17.5 26 19 24 19 22"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    {/* Alert indicator dot */}
    <circle cx="22" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
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
    {/* 3x3 dot grid with center-right dot shifted */}
    {/* Row 1 */}
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <circle cx="16" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <circle cx="24" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" /> {/* Shifted up */}
    {/* Row 2 */}
    <circle cx="8" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <circle cx="16" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <circle cx="24" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    {/* Row 3 */}
    <circle cx="8" cy="24" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <circle cx="16" cy="24" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <circle cx="24" cy="24" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    {/* Drift indicator - dashed line showing movement */}
    <path
      d="M24 8L24 5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeDasharray="1.5 1.5"
      opacity="0.5"
    />
  </svg>
);

// Step Icons

export const ConnectIcon: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left plug endpoint */}
    <rect x="4" y="12" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <line x1="12" y1="16" x2="14" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    {/* Right plug endpoint */}
    <rect x="20" y="12" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <line x1="18" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    {/* Connection indicator */}
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    {/* Signal waves */}
    <path d="M14 12C15 13 15 19 14 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <path d="M18 12C17 13 17 19 18 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const IngestIcon: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Rounded square container */}
    <rect x="6" y="6" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.8" fill="none" />
    {/* Upload arrow */}
    <path
      d="M16 22V12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M12 15L16 11L20 15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Top line indicating target */}
    <line x1="11" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const MonitorIcon: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Chart baseline */}
    <line x1="4" y1="26" x2="28" y2="26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="4" y1="26" x2="4" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    {/* Analytics line */}
    <path
      d="M6 22L12 16L18 18L26 8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Data point dot */}
    <circle cx="26" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
    {/* Secondary subtle data point */}
    <circle cx="12" cy="16" r="1.5" fill="currentColor" opacity="0.6" />
  </svg>
);
