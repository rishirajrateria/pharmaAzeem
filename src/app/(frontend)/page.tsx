import type { Metadata } from 'next'

import {
  AboutTeaser,
  CertificationsMarquee,
  CtaBand,
  FeaturedCategories,
  FeaturedProducts,
  GlobalOperations,
  Hero,
  HomeFaq,
  ManufacturingTeaser,
  StatsBand,
  Testimonials,
  WhyChooseUs,
} from '@/components/home'
import { JsonLd } from '@/components/seo/JsonLd'
import { getCommerceLabels } from '@/lib/commerce'
import {
  getAllProductsSlim,
  getCategoryTree,
  getCertifications,
  getCountries,
  getFacilities,
  getFeaturedProducts,
  getHomepage,
  getSiteSettings,
} from '@/lib/data'
import { buildMetadata, graph, itemListJsonLd, siteName, webPageJsonLd } from '@/lib/seo'
import { mediaUrl } from '@/lib/utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, home] = await Promise.all([getSiteSettings(), getHomepage()])
  return buildMetadata({
    settings,
    path: '/',
    title: settings.seo?.defaultTitle || siteName(settings),
    description:
      home.hero.subtitle || settings.seo?.defaultDescription || settings.shortDescription,
    image: home.hero.image,
    meta: home.meta,
    absoluteTitle: Boolean(home.meta?.title),
    modifiedTime: home.updatedAt,
  })
}

export default async function HomePage() {
  const [settings, home, tree, products, countries, certifications, facilities, allProducts] =
    await Promise.all([
      getSiteSettings(),
      getHomepage(),
      getCategoryTree(),
      getFeaturedProducts(8),
      getCountries({ served: true }),
      getCertifications({ featured: true }),
      getFacilities(),
      getAllProductsSlim(), // cached – already fetched by getCategoryTree, so this is free
    ])
  const labels = getCommerceLabels(settings)
  const name = siteName(settings)
  const description =
    home.meta?.description ||
    home.hero.subtitle ||
    settings.seo?.defaultDescription ||
    settings.shortDescription
  const totalProducts = allProducts.length

  return (
    <>
      <JsonLd
        data={graph(
          webPageJsonLd({
            path: '/',
            name: home.meta?.title || settings.seo?.defaultTitle || name,
            description,
            image: mediaUrl(home.hero.image, 'large') || mediaUrl(home.hero.image),
            dateModified: home.updatedAt,
          }),
          products.length > 0 &&
            itemListJsonLd(
              products.map((p) => ({
                name: p.title,
                path: `/products/${p.slug}`,
                image: mediaUrl(p.images?.[0], 'card'),
              })),
              'Featured products',
            ),
        )}
      />

      <Hero
        hero={home.hero}
        stats={home.stats}
        certifications={certifications}
        countryCount={countries.length}
      />
      <StatsBand stats={home.stats} />
      <FeaturedCategories categories={tree} totalProducts={totalProducts} />
      <FeaturedProducts products={products} labels={labels} />
      <AboutTeaser intro={home.intro} settings={settings} />
      <WhyChooseUs cards={home.whyUs} />
      <GlobalOperations section={home.globalSection} countries={countries} />
      <ManufacturingTeaser section={home.manufacturingSection} facilities={facilities} />
      <CertificationsMarquee certifications={certifications} />
      <Testimonials testimonials={home.testimonials} />
      <HomeFaq faqs={home.faqs} />
      <CtaBand cta={home.cta} settings={settings} />
    </>
  )
}
