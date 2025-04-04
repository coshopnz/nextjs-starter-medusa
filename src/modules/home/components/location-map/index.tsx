"use client"

import { useEffect, useState } from "react"

type LocationMapProps = {
  locationName: string
  height?: string
  width?: string
}

const LocationMap = ({ locationName, height = "200px", width = "100%" }: LocationMapProps) => {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  if (!isMounted) {
    return <div style={{ height, width }} className="bg-gray-200 rounded-lg flex items-center justify-center">Loading...</div>
  }

  return (
    <div style={{ height, width }} className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-2">📍</div>
        <div className="text-sm text-gray-600">Pickup Location</div>
      </div>
    </div>
  )
}

export default LocationMap 