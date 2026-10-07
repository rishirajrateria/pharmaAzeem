import { ChevronDown, Download, FileText } from 'lucide-react'
import Link from 'next/link'

import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { Badge } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import type { Certification } from '@/payload-types'
import { cn, formatDate } from '@/lib/utils'

import {
  CERT_TYPE_META,
  certAnchor,
  certDocument,
  certStatus,
  formatFileSize,
} from './certifications'

const DATE_OPTS: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }

/** Gradient placeholder shown when a certificate has no scanned image / logo. */
function CertificatePlaceholder({ type, title }: { type: Certification['type']; title: string }) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100"
      aria-hidden="true"
    >
      <div className="absolute inset-0 dots-pattern opacity-70" />
      <div className="absolute inset-x-8 top-6 space-y-2 opacity-60">
        <div className="h-1.5 w-1/2 bg-brand-200/70" />
        <div className="h-1 w-3/4 bg-brand-100" />
        <div className="h-1 w-2/3 bg-brand-100" />
      </div>
      <span className="relative flex h-16 w-16 items-center justify-center glass text-brand-600 shadow-glass">
        <Icon name={CERT_TYPE_META[type].icon} className="h-7 w-7" />
      </span>
      <span className="relative mt-3 text-[10px] uppercase tracking-[0.22em] text-brand-700/80">
        {CERT_TYPE_META[type].singular}
      </span>
      <span className="sr-only">{title}</span>
    </div>
  )
}

/**
 * Licence / certificate card: image (4:3) with type + validity badges, title, issuer,
 * key facts as a definition list, scope, expandable description and a PDF download.
 */
export function CertificateCard({ cert, className }: { cert: Certification; className?: string }) {
  const status = certStatus(cert)
  const doc = certDocument(cert)
  const meta = CERT_TYPE_META[cert.type]
  const validFrom = formatDate(cert.validFrom, DATE_OPTS)
  const validUntil = formatDate(cert.validUntil, DATE_OPTS)
  const hasDescription = Boolean(
    cert.description &&
    typeof cert.description === 'object' &&
    cert.description.root?.children?.length,
  )

  return (
    <article
      id={certAnchor(cert)}
      className={cn(
        'group glass-card relative flex h-full scroll-mt-28 flex-col overflow-hidden !p-0',
        className,
      )}
      aria-labelledby={`${certAnchor(cert)}-title`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Media
          media={cert.image}
          size="card"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="h-full w-full"
          imgClassName="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          fallback={<CertificatePlaceholder type={cert.type} title={cert.title} />}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="absolute left-3 top-3">
          <Badge tone="glass">{meta.singular}</Badge>
        </div>
        <div className="absolute right-3 top-3">
          <Badge
            tone={status === 'valid' ? 'success' : 'ink'}
            className={status === 'valid' ? 'bg-white/80 backdrop-blur' : undefined}
          >
            <span
              className={cn(
                'mr-1.5 inline-block h-1.5 w-1.5',
                status === 'valid' ? 'bg-emerald-500' : 'bg-white/60',
              )}
              aria-hidden="true"
            />
            {status === 'valid' ? 'Valid' : 'Expired'}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3
          id={`${certAnchor(cert)}-title`}
          className="text-lg font-semibold leading-snug text-ink-950"
        >
          {cert.title}
        </h3>
        <p className="mt-1 text-sm text-ink-600">
          <span className="sr-only">Issued by </span>
          {cert.issuer}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-ink-100 pt-4 text-sm">
          {cert.certificateNumber && (
            <div className="col-span-2">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-400">
                Certificate no.
              </dt>
              <dd className="mt-0.5 break-all text-[13px] text-ink-900">
                {cert.certificateNumber}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-400">
              Valid from
            </dt>
            <dd className="mt-0.5 text-ink-900">
              {validFrom ? <time dateTime={cert.validFrom!.slice(0, 10)}>{validFrom}</time> : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-400">
              Valid until
            </dt>
            <dd className="mt-0.5 text-ink-900">
              {validUntil ? (
                <time dateTime={cert.validUntil!.slice(0, 10)}>{validUntil}</time>
              ) : (
                '—'
              )}
            </dd>
          </div>
        </dl>

        {cert.scope && (
          <p className="mt-4 text-sm leading-relaxed text-ink-600">
            <span className="font-semibold text-ink-800">Scope: </span>
            {cert.scope}
          </p>
        )}

        {hasDescription && (
          <details className="group/details mt-3">
            <summary className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
              About this certificate
              <ChevronDown
                className="h-3.5 w-3.5 transition-transform group-open/details:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <RichText data={cert.description} className="mt-2 text-sm [&_p]:text-sm" />
          </details>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {doc ? (
            <a
              href={doc.url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !px-4 !py-2 text-xs"
              aria-label={`Download ${cert.title} (PDF${doc.filesize ? `, ${formatFileSize(doc.filesize)}` : ''})`}
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download PDF
              {doc.filesize ? (
                <span className="text-ink-400">{formatFileSize(doc.filesize)}</span>
              ) : null}
            </a>
          ) : (
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Request a copy
            </Link>
          )}
          <span className="text-[10px] uppercase tracking-[0.18em] text-ink-300">
            {meta.singular}
          </span>
        </div>
      </div>
    </article>
  )
}
