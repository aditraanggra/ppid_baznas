import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { TRPCProvider } from '@/lib/trpc/Provider'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'PPID BAZNAS Kabupaten Cianjur',
    template: '%s | PPID BAZNAS Kabupaten Cianjur',
  },
  description:
    'Pejabat Pengelola Informasi dan Dokumentasi BAZNAS Kabupaten Cianjur. Layanan informasi publik transparan dan akuntabel.',
  keywords: [
    'PPID',
    'BAZNAS',
    'Cianjur',
    'informasi publik',
    'keterbukaan informasi',
    'zakat',
    'infak',
    'sedekah',
  ],
  authors: [{ name: 'PPID BAZNAS Kabupaten Cianjur' }],
  creator: 'PPID BAZNAS Kabupaten Cianjur',
  publisher: 'BAZNAS Kabupaten Cianjur',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'PPID BAZNAS Kabupaten Cianjur',
    title: 'PPID BAZNAS Kabupaten Cianjur',
    description:
      'Layanan informasi publik BAZNAS Kabupaten Cianjur. Transparan, akuntabel, dan mudah diakses.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PPID BAZNAS Kabupaten Cianjur',
    description:
      'Layanan informasi publik BAZNAS Kabupaten Cianjur. Transparan, akuntabel, dan mudah diakses.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  )
}
