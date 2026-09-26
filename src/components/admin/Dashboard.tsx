import React from 'react'

/** Friendly quick-start panel shown above the admin dashboard. */
export const BeforeDashboard: React.FC = () => (
  <div
    style={{
      marginBottom: 32,
      padding: '20px 24px',
      borderRadius: 16,
      border: '1px solid var(--theme-elevation-150)',
      background: 'linear-gradient(135deg, rgba(225,29,46,0.06), rgba(255,102,117,0.03))',
    }}
  >
    <h2 style={{ margin: 0, fontSize: 18 }}>Welcome to the website admin</h2>
    <ul style={{ margin: '12px 0 0', paddingLeft: 18, lineHeight: 1.7, fontSize: 14 }}>
      <li>
        <strong>Catalogue → Categories</strong>: create top-level categories, then sub-categories by choosing a <em>Parent</em>. Each has its own SEO tab.
      </li>
      <li>
        <strong>Catalogue → Products</strong>: add products, assign categories, fill details/description/FAQs and the SEO tab, then <em>Publish</em>.
      </li>
      <li>
        <strong>Site Settings → Commerce</strong>: turn on <em>Show prices</em> to replace &quot;Inquire for pricing&quot; with real prices; edit button labels.
      </li>
      <li>
        <strong>Sales → Inquiries</strong>: every quote request from the website lands here (and is emailed when SMTP is configured).
      </li>
      <li>
        <strong>Pages</strong>: edit the copy, stats, FAQs and SEO of every site page. <strong>Countries</strong>, <strong>Licenses</strong> and <strong>Facilities</strong> power the Global presence, Licenses and Manufacturing pages.
      </li>
    </ul>
  </div>
)
