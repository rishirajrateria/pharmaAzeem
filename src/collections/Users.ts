import type { CollectionConfig, FieldHook } from 'payload'

import { isAdmin, isAdminField, isAdminOrSelf } from '@/access'

/** The very first user created becomes an admin automatically. */
const ensureFirstUserIsAdmin: FieldHook = async ({ operation, req, value }) => {
  if (operation === 'create') {
    const { totalDocs } = await req.payload.count({ collection: 'users' })
    if (totalDocs === 0 && !(value || []).includes('admin')) return [...(value || []), 'admin']
  }
  return value
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Administration',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 14, // 14 days
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      access: { create: isAdminField, update: isAdminField },
      hooks: { beforeChange: [ensureFirstUserIsAdmin] },
      options: [
        { label: 'Admin (full access, manages users & settings)', value: 'admin' },
        { label: 'Editor (manages catalogue & content)', value: 'editor' },
      ],
    },
  ],
}
