"use client"

import { usePathname, useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRightMini } from "@medusajs/icons"
import { Fragment } from "react"

const Breadcrumb = () => {
  const pathname = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  
  // Handle case where pathname might be null
  if (!pathname) return null
  
  // Extract the path without the country code
  const path = pathname.split(`/${countryCode}`)[1]
  if (!path) return null
  
  // Skip rendering breadcrumbs on homepage
  if (path === "/") return null
  
  // Split the path and filter out empty segments
  const segments = path.split("/").filter(Boolean)
  
  // Create readable titles from path segments
  const formatTitle = (segment: string) => {
    // Handle dynamic segments [id], [...slug], etc.
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return segment.slice(1, -1) // Remove brackets
    }
    
    // Convert kebab-case to Title Case
    return segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Define custom breadcrumb structure
  const breadcrumbs = []
  
  // Always add Home as the first item
  breadcrumbs.push({ 
    label: "Home", 
    href: "/" 
  })
  
  // Handle different page types
  if (segments[0] === "products") {
    // For product pages, create Store > Product structure
    breadcrumbs.push({ 
      label: "Store", 
      href: "/store" 
    })
    
    // Add the product name as the last item (non-clickable)
    if (segments.length > 1) {
      breadcrumbs.push({ 
        label: formatTitle(segments[1]), 
        href: null // null href indicates current page (non-clickable)
      })
    }
  } else if (segments[0] === "store") {
    // For store page
    breadcrumbs.push({ 
      label: "Store", 
      href: null // current page
    })
  } else {
    // For other pages, add each segment
    segments.forEach((segment, index) => {
      breadcrumbs.push({
        label: formatTitle(segment),
        href: index === segments.length - 1 ? null : `/${segments.slice(0, index + 1).join("/")}`
      })
    })
  }
  
  return (
    <nav aria-label="Breadcrumb" className="flex items-center px-4 py-2 text-ui-fg-subtle text-small-regular">
      <ol className="flex items-center flex-wrap">
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <li className="flex items-center mx-1">
                <ArrowRightMini className="w-4 h-4" />
              </li>
            )}
            <li>
              {crumb.href ? (
                <LocalizedClientLink
                  href={crumb.href}
                  className="hover:text-ui-fg-base"
                >
                  {crumb.label}
                </LocalizedClientLink>
              ) : (
                <span className="font-medium text-ui-fg-base" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb 