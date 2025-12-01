import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Banking App',
  description: 'Sistema bancário',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

