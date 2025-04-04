"use client"

import { useEffect } from "react"

export default function ScrollToTop() {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo({
      top: 0,
      behavior: "auto" // You can use "auto" instead for instant scrolling
    })
  }, [])

  return null // This component doesn't render anything
} 