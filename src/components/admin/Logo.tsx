import React from 'react'

/** Branding for the Payload admin login screen. */
export const AdminLogo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <defs>
        <linearGradient id="adm-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bd1225" />
          <stop offset="55%" stopColor="#e11d2e" />
          <stop offset="100%" stopColor="#ff6675" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" fill="url(#adm-a)" />
      <g transform="rotate(-45 20 20)">
        <rect x="8" y="14.5" width="24" height="11" rx="5.5" fill="#fff" />
        <rect x="8" y="14.5" width="12" height="11" rx="5.5" fill="#fff" opacity="0.5" />
      </g>
    </svg>
    <div style={{ lineHeight: 1.1 }}>
      <div style={{ fontWeight: 600, fontSize: 18 }}>Azeem Pharmaceuticals</div>
      <div
        style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6 }}
      >
        Website admin
      </div>
    </div>
  </div>
)

export const AdminIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" width="26" height="26" aria-hidden="true">
    <defs>
      <linearGradient id="adm-b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#bd1225" />
        <stop offset="100%" stopColor="#ff6675" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="36" height="36" fill="url(#adm-b)" />
    <g transform="rotate(-45 20 20)">
      <rect x="8" y="14.5" width="24" height="11" rx="5.5" fill="#fff" />
      <rect x="8" y="14.5" width="12" height="11" rx="5.5" fill="#fff" opacity="0.5" />
    </g>
  </svg>
)
