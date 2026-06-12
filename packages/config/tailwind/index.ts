import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

/**
 * Shared Tailwind preset for all apps & packages.
 * Encodes the BAZNAS brand tokens from AGENTS.md Section 10.
 */
const preset: Partial<Config> = {
  theme: {
    container: {
      center:  true,
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#259148',
          dark:    '#145c2e',
          light:   '#e8f5ee',
        },
        secondary: { DEFAULT: '#1a5276' },
        accent:    { DEFAULT: '#fdc727' },
        surface:   '#f5f5f5',
        border:    '#dddddd',
        muted: {
          DEFAULT:    '#f5f5f5',
          foreground: '#4a4a4a',
        },
        foreground: '#1a1a1a',
        background: '#ffffff',
        destructive: {
          DEFAULT:    '#dc2626',
          foreground: '#ffffff',
        },
        ring:  '#259148',
        input: '#dddddd',
      },
      fontFamily: {
        sans:    ['var(--font-inter)',    'Inter',             'system-ui', 'sans-serif'],
        heading: ['var(--font-jakarta)',  'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
}

export default preset
