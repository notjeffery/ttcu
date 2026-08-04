// PLACEHOLDER LOGO — replace with the real bank mark when it's ready.
// Drop the final asset in /public and swap PlaceholderMark below for
// an <img> or next/image pointing at it.

export function PlaceholderMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label="ttcu logo placeholder"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#117ACA" />
        <path
          d="M9 21V11L16 15.5L23 11V21"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-semibold text-brand-navy tracking-tight">
        ttcu
      </span>
    </div>
  );
}

export default function Logo(props: { className?: string }) {
  return <PlaceholderMark {...props} />;
}