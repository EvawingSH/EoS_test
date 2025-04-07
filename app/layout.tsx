import "./globals.css"
import Navbar from "@/components/Navbar"
import { Providers } from "./providers"
import type React from "react"

export const metadata = {
  title: "EoS Software Management",
  description: "End of Support Software Management Application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background font-sans text-foreground">
        <Providers>
          <div className="flex h-screen">
            <Navbar />
            <main className="flex-1 p-8 overflow-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'