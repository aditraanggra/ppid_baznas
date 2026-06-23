'use client'

import { useEffect, useRef, useState } from 'react'

interface CounterProps {
  value: number
  label: string
  suffix?: string
  inverted?: boolean
}

export function Counter({ value, label, suffix = '', inverted = false }: CounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value)
      return
    }

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <div ref={ref} className="px-4 py-5 text-center first:pl-6 last:pr-6 md:py-6">
      <div className={`mb-1.5 font-heading text-3xl font-bold tabular-nums tracking-tight md:text-4xl ${inverted ? 'text-white' : 'text-foreground'}`}>
        {count}
        {suffix}
      </div>
      <div className={`text-xs font-medium tracking-wide ${inverted ? 'text-white/70' : 'text-muted-foreground'}`}>
        {label}
      </div>
    </div>
  )
}
