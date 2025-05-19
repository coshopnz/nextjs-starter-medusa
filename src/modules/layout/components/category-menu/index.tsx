"use client"

import { Popover, Transition } from "@headlessui/react"
import { Fragment } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HamburgerIcon from "@modules/common/icons/hamburger"

interface MenuItem {
  name: string
  href: string
}

const menuItems: MenuItem[] = [
  { name: "About", href: "/about" },
]

const CategoryMenu = () => {
  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button 
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                  data-testid="category-menu-button"
                >
                  <HamburgerIcon className="w-5 h-5" />
                  <span className="ml-2 font-medium sm:block hidden">Menu</span>
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Popover.Panel 
                  className="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50"
                  data-testid="category-menu-popup"
                >
                  {menuItems.map((item) => (
                    <LocalizedClientLink
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={close}
                      data-testid={`${item.name.toLowerCase()}-link`}
                    >
                      {item.name}
                    </LocalizedClientLink>
                  ))}
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default CategoryMenu 