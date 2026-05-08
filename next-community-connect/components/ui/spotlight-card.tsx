'use client'

import React, { useEffect, useRef, ReactNode, CSSProperties } from 'react'

interface GlowCardProps {
  children?: ReactNode
  className?: string
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange'
  size?: 'sm' | 'md' | 'lg'
  width?: string | number
  height?: string | number
  customSize?: boolean
  dark?: boolean
  extraVars?: Record<string, string>
}

const glowColorMap = {
  blue:   { base: 210, spread: 60 },
  purple: { base: 280, spread: 60 },
  green:  { base: 150, spread: 60 },
  red:    { base: 0,   spread: 60 },
  orange: { base: 30,  spread: 60 },
}

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  dark = false,
  extraVars = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2))
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2))
        cardRef.current.style.setProperty('--y', y.toFixed(2))
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2))
      }
    }
    document.addEventListener('pointermove', syncPointer)
    return () => document.removeEventListener('pointermove', syncPointer)
  }, [])

  const { base, spread } = glowColorMap[glowColor]
  const backdrop = dark
    ? 'hsl(210 80% 6% / 0.75)'
    : 'hsl(210 60% 97% / 0.65)'
  const borderColor = dark
    ? 'rgba(86,187,240,0.18)'
    : 'rgba(36,153,214,0.20)'

  const inlineStyles: CSSProperties & Record<string, string | number> = {
    '--base': base,
    '--spread': spread,
    '--radius': '18',
    '--border': '2',
    '--backdrop': backdrop,
    '--backup-border': borderColor,
    '--size': '280',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 200) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    '--saturation': '90',
    '--lightness': dark ? '65' : '60',
    '--bg-spot-opacity': dark ? '0.12' : '0.08',
    '--border-spot-opacity': dark ? '0.8' : '0.6',
    '--border-light-opacity': dark ? '0.3' : '0.2',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 90) * 1%) calc(var(--lightness, 65) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
    )`,
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'fixed',
    border: `var(--border-size) solid var(--backup-border)`,
    position: 'relative',
    touchAction: 'none',
    backdropFilter: 'blur(20px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
    ...extraVars,
  }

  if (width !== undefined) (inlineStyles as Record<string, unknown>).width = typeof width === 'number' ? `${width}px` : width
  if (height !== undefined) (inlineStyles as Record<string, unknown>).height = typeof height === 'number' ? `${height}px` : height

  const beforeAfterCSS = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: fixed;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 90) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 0.8)), transparent 100%
      );
      filter: brightness(1.8);
    }
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
        hsl(0 100% 100% / var(--border-light-opacity, 0.25)), transparent 100%
      );
    }
    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }
    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterCSS }} />
      <div
        ref={cardRef}
        data-glow
        style={inlineStyles}
        className={`
          ${!customSize ? sizeMap[size] : ''}
          rounded-2xl relative grid shadow-[0_1rem_3rem_-1rem_rgba(4,64,105,0.35)]
          ${className}
        `}
      >
        <div ref={innerRef} data-glow />
        {children}
      </div>
    </>
  )
}

export { GlowCard }
