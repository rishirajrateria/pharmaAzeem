import type { Metadata, Viewport } from 'next'
import { body } from '@/fonts'
import Script from 'next/script'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { InquiryDrawer } from '@/components/inquiry/InquiryDrawer'
import { JsonLd } from '@/components/seo/JsonLd'
import { getCommerceLabels } from '@/lib/commerce'
import { getCertifications, getCountries, getSiteSettings } from '@/lib/data'
import { graph, organizationJsonLd, siteName, websiteJsonLd } from '@/lib/seo'
import { mediaUrl, SITE_URL } from '@/lib/utils'

import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const name = siteName(settings)
  const description = settings.seo?.defaultDescription || settings.shortDescription || undefined
  const ogImage = mediaUrl(settings.seo?.defaultImage, 'og')
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: name,
    title: {
      default: settings.seo?.defaultTitle || name,
      template: settings.seo?.titleTemplate || `%s | ${name}`,
    },
    description,
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    formatDetection: { email: false, address: false, telephone: false },
    manifest: '/manifest.webmanifest',
    openGraph: {
      type: 'website',
      siteName: name,
      locale: 'en_US',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: 'summary_large_image', site: settings.seo?.twitterHandle || undefined },
    verification: {
      google: settings.seo?.googleSiteVerification || undefined,
      other: settings.seo?.bingSiteVerification
        ? { 'msvalidate.01': settings.seo.bingSiteVerification }
        : undefined,
    },
    category: 'pharmaceuticals',
  }
}

export const viewport: Viewport = {
  themeColor: '#af0201',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, countries, certs] = await Promise.all([
    getSiteSettings(),
    getCountries({ served: true }),
    getCertifications({ featured: true }),
  ])
  const labels = getCommerceLabels(settings)
  const ga = settings.seo?.gaMeasurementId

  return (
    <html lang="en" className={body.variable}>
      <body className="mesh-bg min-h-dvh font-sans">
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <JsonLd
          data={graph(
            organizationJsonLd(settings, { countries, certifications: certs }),
            websiteJsonLd(settings),
          )}
        />
        <Header />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />
        <InquiryDrawer
          labels={{ listName: labels.listName, ctaLabel: labels.ctaLabel, mode: labels.mode }}
        />
        {ga && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
