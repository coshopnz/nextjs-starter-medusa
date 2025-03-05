import { Metadata } from "next"
import "styles/globals.css"
import { Providers } from "@lib/providers"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <Providers>
          <main className="relative">{props.children}</main>
        </Providers>
      </body>
    </html>
  )
}
