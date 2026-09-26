import { getLayoutData } from '@/lib/data'
import { getCommerceLabels } from '@/lib/commerce'
import { mediaUrl } from '@/lib/utils'

import { HeaderClient } from './HeaderClient'
import { toNav } from './nav'

export async function Header() {
  const { settings, tree } = await getLayoutData()
  const labels = getCommerceLabels(settings)
  return (
    <HeaderClient
      siteName={settings.siteName}
      tagline={settings.tagline}
      logo={mediaUrl(settings.logo)}
      nav={toNav(tree)}
      labels={{ listName: labels.listName, ctaLabel: labels.ctaLabel }}
      announcement={
        settings.announcement?.enabled
          ? { text: settings.announcement.text || '', url: settings.announcement.url || undefined }
          : null
      }
      phone={settings.contact?.phone || undefined}
      email={settings.contact?.email || undefined}
    />
  )
}
