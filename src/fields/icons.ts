/** Canonical icon names available in admin selects. Must match the map in src/components/ui/Icon.tsx. */
export const ICON_NAMES = [
  'activity', 'atom', 'award', 'baby', 'badge-check', 'beaker', 'bone', 'boxes', 'brain', 'briefcase-medical', 'bug', 'building-2',
  'clipboard-check', 'clipboard-list', 'clock', 'compass', 'cpu', 'cross', 'dna', 'droplets', 'earth', 'eye', 'factory', 'file-badge',
  'file-check', 'fingerprint', 'flag', 'flask-conical', 'gauge', 'globe', 'handshake', 'headset', 'heart-handshake', 'heart-pulse',
  'hexagon', 'hospital', 'landmark', 'layers', 'leaf', 'lock', 'microscope', 'package', 'package-check', 'pill', 'capsule', 'pill-bottle',
  'plane', 'radar', 'recycle', 'rocket', 'route', 'scale', 'search-check', 'ship', 'shield-check', 'shield-plus', 'sparkles', 'sprout',
  'stamp', 'stethoscope', 'sun', 'syringe', 'tablets', 'target', 'test-tubes', 'thermometer', 'timer', 'truck', 'users', 'warehouse',
  'wind', 'zap',
] as const

export type IconName = (typeof ICON_NAMES)[number]

export const iconOptions = () => ICON_NAMES.map((v) => ({ label: v, value: v }))
