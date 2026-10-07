import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Container, Section } from '@/components/ui'

export default function NotFound() {
  return (
    <Section className="flex min-h-[70vh] items-center bg-white" aria-labelledby="not-found-title">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">404</p>
          <h1 id="not-found-title" className="display-2 mt-4">
            This page could not be found
          </h1>
          <p className="lead mx-auto mt-4 max-w-xl">
            The product or page you are looking for may have moved. Browse the catalogue or get in
            touch and we will point you in the right direction.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-primary">
              Browse products <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact us
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}
