import type { Config } from 'tailwindcss'
import preset from '@ppid/config/tailwind'

const config: Config = {
  presets: [preset as Config],
  content: [
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
}

export default config
