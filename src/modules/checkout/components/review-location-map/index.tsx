"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import pickupLocationsData from "../../../home/components/pickup-location-selector/pickup-locations.json"

// Fix Leaflet's default icon issue
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  })
}

type ReviewLocationMapProps = {
  locationName: string
  height?: string
  width?: string
}

const ReviewLocationMap = ({ locationName, height = "200px", width = "100%" }: ReviewLocationMapProps) => {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  // Find the location data from the JSON file
  const location = pickupLocationsData.locations.find(
    loc => loc.name === locationName
  )

  if (!isMounted || !location || !location.coordinates) {
    return <div style={{ height, width }} className="bg-gray-200 rounded-lg flex items-center justify-center">Loading location...</div>
  }

  return (
    <div style={{ height, width }} className="rounded-lg overflow-hidden">
      <MapContainer 
        key={locationName}
        center={[location.coordinates.lat, location.coordinates.lng]} 
        zoom={15} 
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.coordinates.lat, location.coordinates.lng]}>
          <Popup>
            <strong>{location.name}</strong><br />
            {location.description}<br />
            <span className="text-sm text-gray-500">Area: {location.area}</span><br />
            <span className="text-sm text-gray-500">Times: {location.times}</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default ReviewLocationMap 