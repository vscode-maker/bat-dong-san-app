import type React from "react"
import Link from "next/link"
import type { Property } from "@/types"
import FavoriteButton from "./favorite-button"
import SafeImage from "./safe-image"

interface PropertyCardProps {
  property: Property
  layout?: "grid" | "list"
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, layout = "grid" }) => {
  return (
    <div className="relative rounded-lg shadow-md overflow-hidden">
      <FavoriteButton propertyId={property.id} size="sm" className="absolute top-2 right-2 z-10" />
      {/* Link itself renders an <a>, so no nested anchor */}
      <Link
        href={`/property/${property.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      >
        {layout === "list" ? (
          <div className="flex">
            <div className="relative w-32 h-24 shrink-0">
              <SafeImage
                fill
                className="object-cover"
                alt={property.title}
                src={
                  property.image ||
                  property.images?.[0] ||
                  "/placeholder.svg?height=96&width=128&query=real-estate-property"
                }
              />
            </div>
            <div className="flex-1 p-3">
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{property.title}</h3>
              <p className="mt-1 text-xs text-gray-600">{property.location || property.address}</p>
              <p className="mt-1 font-bold text-gray-900 text-sm">
                {property.priceText || `${property.price?.toLocaleString()} VND`}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative h-56 w-full">
              <SafeImage
                fill
                className="object-cover"
                alt={property.title}
                src={
                  property.image ||
                  property.images?.[0] ||
                  "/placeholder.svg?height=224&width=400&query=real-estate-property"
                }
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{property.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{property.location || property.address}</p>
              <p className="mt-2 font-bold text-gray-900">
                {property.priceText || `${property.price?.toLocaleString()} VND`}
              </p>
            </div>
          </>
        )}
      </Link>
    </div>
  )
}

export default PropertyCard
