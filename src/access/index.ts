import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

export const hasRole = (user: null | undefined | User, roles: Array<'admin' | 'editor'>) =>
  Boolean(user?.roles?.some((r) => roles.includes(r as 'admin' | 'editor')))

/** Only logged-in admins. */
export const isAdmin: Access = ({ req: { user } }) => hasRole(user, ['admin'])

/** Admins and editors (content managers). */
export const isStaff: Access = ({ req: { user } }) => hasRole(user, ['admin', 'editor'])

/** Anyone. */
export const anyone: Access = () => true

/** Admins see everything; the public only sees published documents. */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (hasRole(user, ['admin', 'editor'])) return true
  return { _status: { equals: 'published' } }
}

export const isAdminField: FieldAccess = ({ req: { user } }) => hasRole(user, ['admin'])

/** Admins can do anything, users can read/update themselves. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasRole(user, ['admin'])) return true
  return { id: { equals: user.id } }
}
