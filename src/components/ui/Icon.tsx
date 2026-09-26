import {
  Activity, Atom, Award, Baby, BadgeCheck, Beaker, Bone, Boxes, Brain, BriefcaseMedical, Bug, Building2, ClipboardCheck,
  ClipboardList, Clock, Compass, Cpu, Cross, Dna, Droplets, Earth, Eye, Factory, FileBadge, FileCheck, Fingerprint, Flag,
  FlaskConical, Gauge, Globe, Handshake, Headset, HeartHandshake, HeartPulse, Hexagon, Hospital, Landmark, Layers, Leaf,
  Lock, Microscope, Package, PackageCheck, Pill, PillBottle, Plane, Radar, Recycle, Rocket, Route, Scale, SearchCheck,
  Ship, ShieldCheck, ShieldPlus, Sparkles, Sprout, Stamp, Stethoscope, Sun, Syringe, Tablets, Target, TestTubes,
  Thermometer, Timer, Truck, Users, Warehouse, Wind, Zap, type LucideIcon, type LucideProps,
} from 'lucide-react'

/**
 * Maps the icon names stored in the CMS (select options) to lucide components.
 * Only the icons listed here are bundled – keep the list in sync with src/fields/page.ts and Categories.ts.
 */
export const ICONS: Record<string, LucideIcon> = {
  activity: Activity, atom: Atom, award: Award, baby: Baby, 'badge-check': BadgeCheck, beaker: Beaker, bone: Bone,
  boxes: Boxes, brain: Brain, 'briefcase-medical': BriefcaseMedical, bug: Bug, 'building-2': Building2,
  'clipboard-check': ClipboardCheck, 'clipboard-list': ClipboardList, clock: Clock, compass: Compass, cpu: Cpu,
  cross: Cross, dna: Dna, droplets: Droplets, earth: Earth, eye: Eye, factory: Factory, 'file-badge': FileBadge,
  'file-check': FileCheck, fingerprint: Fingerprint, flag: Flag, 'flask-conical': FlaskConical, gauge: Gauge,
  globe: Globe, handshake: Handshake, headset: Headset, 'heart-handshake': HeartHandshake, 'heart-pulse': HeartPulse,
  hexagon: Hexagon, hospital: Hospital, landmark: Landmark, layers: Layers, leaf: Leaf, lock: Lock,
  microscope: Microscope, package: Package, 'package-check': PackageCheck, pill: Pill, capsule: Tablets,
  'pill-bottle': PillBottle, plane: Plane, radar: Radar, recycle: Recycle, rocket: Rocket, route: Route, scale: Scale,
  'search-check': SearchCheck, ship: Ship, 'shield-check': ShieldCheck, 'shield-plus': ShieldPlus, sparkles: Sparkles,
  sprout: Sprout, stamp: Stamp, stethoscope: Stethoscope, sun: Sun, syringe: Syringe, tablets: Tablets, target: Target,
  'test-tubes': TestTubes, thermometer: Thermometer, timer: Timer, truck: Truck, users: Users, warehouse: Warehouse,
  wind: Wind, zap: Zap,
}

export type IconName = keyof typeof ICONS

export function Icon({ name, fallback = 'sparkles', ...props }: { name?: string | null; fallback?: IconName } & Omit<LucideProps, 'name'>) {
  const Cmp = (name && ICONS[name]) || ICONS[fallback]
  return <Cmp aria-hidden="true" {...props} />
}
