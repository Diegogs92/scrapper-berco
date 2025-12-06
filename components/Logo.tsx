export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      <rect width="64" height="64" rx="12" fill="currentColor" className="text-emerald-500" />
      <path
        d="M32 12L20 20V32L32 40L44 32V20L32 12Z"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="26" r="3" fill="white" />
      <path
        d="M24 35L28 31M40 35L36 31M32 38V42M28 42H36"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 46H48M18 52H46"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="22" cy="46" r="1.5" fill="white" />
      <circle cx="32" cy="46" r="1.5" fill="white" />
      <circle cx="42" cy="46" r="1.5" fill="white" />
    </svg>
  );
}
