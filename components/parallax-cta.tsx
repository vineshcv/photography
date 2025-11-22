"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ParallaxCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !imageRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionTop = rect.top
      const sectionHeight = rect.height
      
      // Calculate parallax effect when section is in viewport
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // Parallax speed factor (adjust for desired effect)
        const speed = 0.5
        const yPos = -(sectionTop * speed)
        imageRef.current.style.transform = `translateY(${yPos}px)`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background Image with Parallax */}
      <div ref={imageRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <Image
          src="/kerala-wedding-photos/wedding"
          alt="Kerala Wedding"
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      
      <div className="container mx-auto px-4 text-center space-y-8 relative z-10">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white">
          Ready to capture Kerala wedding memories?
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto">
          Join professional Kerala wedding photographers who trust our platform for preserving beautiful Malayalee wedding traditions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base w-full sm:w-auto bg-white text-primary hover:bg-white/90">
              Get Started for Free
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

