export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" role="img" aria-label="DM PASS">
      <rect width="512" height="512" rx="112" fill="#0A0A0A" />
      <path d="M256 70 420 165v182L256 442 92 347V165z" fill="#FFB800" />
      <path d="M256 70 420 165 256 260 92 165z" fill="#DC2626" opacity=".9" />
      <path d="M168 215h58a50 50 0 0 1 0 100h-58zM282 315V215l40 48 40-48v100" fill="none" stroke="#0A0A0A" strokeWidth="28" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
