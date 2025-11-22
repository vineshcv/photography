"use client"

import { useEffect, useRef } from "react"

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
}

export function ParallaxSection({ children, className = "" }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !imageRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate parallax effect when section is in viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrolled = window.scrollY
        const rate = scrolled * 0.5
        imageRef.current.style.transform = `translateY(${rate}px)`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  )
}

export function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return

      const rect = imageRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate parallax effect when image is in viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrolled = window.scrollY
        const rate = scrolled * 0.3
        imageRef.current.style.transform = `translateY(${rate}px)`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div ref={imageRef} className={className} style={{ willChange: "transform" }}>
      {/* Image will be rendered by parent */}
    </div>
  )
}

