import { Metadata } from "next"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import Breadcrumb from "@modules/common/components/breadcrumb"
import MobileCheckoutButton from "@modules/layout/components/mobile-checkout-button"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <Breadcrumb />
      {props.children}
      <Footer />
      <MobileCheckoutButton />
    </>
  )
}
