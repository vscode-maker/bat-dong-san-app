"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"

interface SafeImageProps extends Omit<ImageProps, "src" | "onError" | "alt"> {
  src: string | undefined | null
  alt: string
  fallback?: string
}

/**
 * A drop-in replacement for next/image that switches to a placeholder
 * whenever the original image fails to load.
 */
export default function SafeImage({
  src,
  alt,
  fallback = "/placeholder.svg?height=200&width=300",
  ...rest
}: SafeImageProps) {
  const [broken, setBroken] = useState(false)

  const finalSrc = !broken && src ? src : fallback

  return <Image {...rest} src={finalSrc || "/placeholder.svg"} alt={alt} onError={() => setBroken(true)} />
}
