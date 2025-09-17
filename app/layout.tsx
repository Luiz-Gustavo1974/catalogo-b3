import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B3 Ambientes Corporativos | Catálogo Digital',
  description: 'Catálogo digital de móveis corporativos B3. Encontre cadeiras, mesas, estações de trabalho e mais para seu projeto.',
  keywords: 'móveis corporativos, B3, cadeiras, mesas, estações trabalho, escritório',
  authors: [{ name: 'B3 Ambientes Corporativos' }],
  creator: 'B3 Ambientes Corporativos',
  publisher: 'B3 Ambientes Corporativos',
  openGraph: {
    title: 'B3 Ambientes Corporativos | Catálogo Digital',
    description: 'Catálogo digital de móveis corporativos B3',
    url: 'https://catalogob3.vercel.app',
    siteName: 'B3 Catálogo',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: '#2563eb',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>{children}</body>
    </html>
  )
}
