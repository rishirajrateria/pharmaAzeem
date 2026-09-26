import { useId } from 'react'

import { cn } from '@/lib/utils'

/**
 * Decorative molecule / hexagon lattice drawn in SVG — a futuristic pharma motif.
 * Uses stroke-dasharray animation for a "drawing" feel. Cheap: one SVG, few nodes.
 */
export function MoleculeField({
  className,
  animated = true,
}: {
  className?: string
  animated?: boolean
}) {
  const gid = `mf-g-${useId().replace(/:/g, '')}`
  const nodes = [
    [40, 60],
    [120, 30],
    [200, 70],
    [280, 40],
    [360, 90],
    [90, 150],
    [170, 130],
    [250, 160],
    [330, 140],
    [60, 240],
    [140, 220],
    [230, 250],
    [310, 230],
    [390, 200],
  ]
  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 5],
    [1, 6],
    [2, 7],
    [3, 8],
    [5, 6],
    [6, 7],
    [7, 8],
    [5, 9],
    [6, 10],
    [7, 11],
    [8, 12],
    [9, 10],
    [10, 11],
    [11, 12],
    [12, 13],
    [4, 8],
  ]
  return (
    <svg
      viewBox="0 0 420 280"
      className={cn('h-auto w-full', className)}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#e11d2e" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff6675" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke={`url(#${gid})`}
          strokeWidth="1"
          strokeOpacity="0.5"
          strokeDasharray={animated ? '6 6' : undefined}
          className={animated ? 'animate-draw' : undefined}
          style={animated ? { animationDelay: `${(i % 7) * -0.4}s` } : undefined}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 7 : 4.5}
            fill="white"
            stroke="#e11d2e"
            strokeOpacity="0.6"
            strokeWidth="1.2"
          />
          {i % 3 === 0 && <circle cx={x} cy={y} r={2.5} fill="#e11d2e" />}
        </g>
      ))}
    </svg>
  )
}

/** Concentric HUD rings – used behind hero visuals. */
export function HudRings({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden',
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute h-[34rem] w-[34rem] animate-spin-slower rounded-full border border-dashed border-brand-300/40" />
      <div className="absolute h-[26rem] w-[26rem] animate-spin-slow rounded-full border border-brand-200/60" />
      <div className="absolute h-[18rem] w-[18rem] rounded-full border border-brand-300/30" />
      <div className="absolute h-[26rem] w-[26rem] animate-spin-slow">
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-brand-600 shadow-[0_0_0_6px_rgb(225_29_46_/_0.15)]" />
      </div>
    </div>
  )
}
