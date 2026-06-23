import React from 'react'

export const metadata = {
  description: 'CMS PPID BAZNAS Kabupaten Cianjur',
  title: 'CMS PPID BAZNAS Cianjur',
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <main>{props.children}</main>
      </body>
    </html>
  )
}
