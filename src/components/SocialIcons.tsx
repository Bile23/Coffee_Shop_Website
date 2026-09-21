export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M14 21v-7h2.5l.5-3H14V9c0-.9.3-1.5 1.7-1.5H17V5c-.3 0-1.3-.1-2.2-.1-2.5 0-4 1.5-4 4.2V11H8v3h2.8v7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TwitterIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M18 5.5c-.6.4-1.3.6-2 .8a3 3 0 0 0-5.1 2.7C8.2 8.8 6.2 7.8 4.8 6.1c-.7 1.2-.3 2.7.9 3.5-.6 0-1.1-.2-1.6-.4 0 1.3.9 2.4 2.1 2.7-.5.1-1 .2-1.6.1.5 1.1 1.6 1.9 2.9 2C6.5 15 5 15.5 3.3 15.3c1.3.9 2.9 1.4 4.6 1.4 5.5 0 8.6-4.7 8.4-8.9.6-.4 1.1-1 1.5-1.6-.5.2-1.1.4-1.8.5.6-.4 1-1 1.2-1.7"
        fill="currentColor"
      />
    </svg>
  );
}
