import { Suspense } from "react"

import { listRegions } from "@lib/data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import NavLinkLogos from "@modules/common/components/nav-link-logos"
import HomeIcon from "@modules/common/icons/home"

export default async function Nav() {
  const regions = await listRegions().then((regions) => regions)

  return (
    <div className="sticky inset-x-0 top-0 z-50 group">
      <header className="relative h-16 mx-auto duration-200 bg-white border-b border-ui-border-base">
        <nav className="flex items-center justify-between w-full h-full content-container txt-xsmall-plus text-ui-fg-subtle text-small-regular">
          <div className="items-center flex h-full sm:flex-1 basis-0">
            {/* Home button on the left */}
            <LocalizedClientLink
              href="/"
              className="flex items-center justify-center h-full px-4 hover:text-ui-fg-base"
              data-testid="nav-home-button"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="ml-2 font-medium sm:block hidden">Home</span>
            </LocalizedClientLink>
          </div>

          <div className="flex justify-center h-full">
            <NavLinkLogos />           
          </div>

          <div className="flex items-center justify-end h-full sm:flex-1">
            {/* <div className="items-center hidden h-full small:flex gap-x-6">
              {process.env.FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                  data-testid="nav-search-link"
                >
                  Search
                </LocalizedClientLink>
              )}
            </div> */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex w-full gap-2 hover:text-ui-fg-base"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
