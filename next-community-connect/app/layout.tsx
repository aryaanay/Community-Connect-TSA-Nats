import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Nunito, DM_Sans } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { LayoutShell } from "@/components/LayoutShell"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Community Connect - Local Community Resource Hub",
  description: "Community Connect is your local hub for finding volunteers, community events, support services, and non-profits in your area.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${nunito.variable} ${dmSans.variable}`}>
      <body className="font-dm-sans antialiased">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  )
}
