"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Define location coordinates
const LOCATION_COORDINATES = {
  "Central Park Apartments Community Room": { lat: -41.2977, lng: 174.7696, address: "18 Nairn Street, Mount Cook, Wellington 6011" },
  "Karori Community Center": { lat: -41.2852, lng: 174.7382, address: "7 Beauchamp St, Karori, Wellington" }
}

// Fix Leaflet's default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

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

  if (!isMounted || !LOCATION_COORDINATES[locationName as keyof typeof LOCATION_COORDINATES]) {
    return <div style={{ height, width }} className="bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
  }

  const position = LOCATION_COORDINATES[locationName as keyof typeof LOCATION_COORDINATES]

  return (
    <div style={{ height, width }}>
      <MapContainer 
        center={[position.lat, position.lng]} 
        zoom={12} 
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[position.lat, position.lng]}>
          <Popup>
            <strong>{locationName}</strong><br />
            {position.address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default LocationMap 