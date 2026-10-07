import React from 'react'

/** Branding for the Payload admin login screen. */
export const AdminLogo: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/brand/pharmadent-logo.png" alt="Pharmadent Remedies" width={244} height={64} />
    <div
      style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6 }}
    >
      Website admin
    </div>
  </div>
)

/** Square "R" mark for the admin navigation. */
export const AdminIcon: React.FC = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/brand/icon-192.png" alt="" width={26} height={26} />
)
