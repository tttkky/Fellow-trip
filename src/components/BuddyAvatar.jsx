export default function BuddyAvatar({ type = "round-bot", className = "", title }) {
  const label = title ?? `${type} buddy avatar`;

  return (
    <span className={`buddy-avatar-art buddy-avatar-${type} ${className}`.trim()} role="img" aria-label={label}>
      <BuddyShape type={type} />
    </span>
  );
}

export function BuddyShape({ type = "round-bot" }) {
  switch (type) {
    case "fox-guide":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <polygon points="18,38 22,8 46,32" fill="#ea580c" />
          <polygon points="82,38 78,8 54,32" fill="#ea580c" />
          <polygon points="24,34 26,16 40,30" fill="#ffedd5" />
          <polygon points="76,34 74,16 60,30" fill="#ffedd5" />
          <polygon points="16,38 84,38 50,78" fill="#f97316" />
          <polygon points="16,38 36,38 26,56" fill="#ffffff" />
          <polygon points="84,38 64,38 74,56" fill="#ffffff" />
          <circle cx="38" cy="44" r="4" fill="#1e293b" />
          <circle cx="62" cy="44" r="4" fill="#1e293b" />
          <polygon points="46,72 54,72 50,78" fill="#1e293b" />
          <path d="M38 72 L50 88 L62 72 Z" fill="#ef4444" />
        </svg>
      );
    case "cloud-cat":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <polygon points="22,34 30,10 48,28" fill="#a855f7" />
          <polygon points="78,34 70,10 52,28" fill="#a855f7" />
          <path d="M22 46 C12 46, 12 28, 30 28 C36 16, 64 16, 70 28 C88 28, 88 46, 78 46 C88 60, 74 74, 50 74 C26 74, 12 60, 22 46 Z" fill="#f3e8ff" />
          <path d="M34 42 Q40 46 42 42" stroke="#a855f7" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M66 42 Q60 46 58 42" stroke="#a855f7" strokeWidth="3" fill="none" strokeLinecap="round" />
          <polygon points="47,51 53,51 50,55" fill="#f43f5e" />
          <line x1="18" y1="46" x2="6" y2="44" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="52" x2="4" y2="53" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="46" x2="94" y2="44" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="52" x2="96" y2="53" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "human-guide":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <path d="M26 36 C26 18, 74 18, 74 36 Z" fill="#475569" />
          <path d="M36 24 L86 28 C86 28, 86 36, 70 36 Z" fill="#64748b" />
          <circle cx="50" cy="50" r="23" fill="#fed7aa" />
          <rect x="31" y="44" width="17" height="11" rx="4" fill="#1e293b" />
          <rect x="52" y="44" width="17" height="11" rx="4" fill="#1e293b" />
          <line x1="48" y1="47" x2="52" y2="47" stroke="#1e293b" strokeWidth="3" />
          <path d="M43 60 Q50 66 57 60" stroke="#4a0404" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M25 82 C25 72, 32 70, 50 70 C68 70, 75 72, 75 82 Z" fill="#475569" />
        </svg>
      );
    case "round-bot":
    default:
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <rect x="47" y="5" width="6" height="12" rx="3" fill="#0ea5e9" />
          <circle cx="50" cy="5" r="4" fill="#f43f5e" />
          <rect x="20" y="16" width="60" height="52" rx="16" fill="#0ea5e9" />
          <rect x="28" y="24" width="44" height="28" rx="8" fill="#1e293b" />
          <circle cx="42" cy="38" r="4" fill="#22c55e" />
          <circle cx="58" cy="38" r="4" fill="#22c55e" />
          <path d="M30 68 C30 68, 25 90, 50 90 C75 90, 70 68, 70 68 Z" fill="#38bdf8" />
        </svg>
      );
  }
}
