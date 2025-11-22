"use client"

import React, { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Heart, Sparkles, Home } from 'lucide-react'
import { api } from "@/lib/api"

export default function SuccessPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = React.use(params)
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const confettiRef = useRef<any[]>([])
  const fireworksRef = useRef<any[]>([])
  const [submitted, setSubmitted] = React.useState(false)

  // Submit selection when page loads
  useEffect(() => {
    const submitSelection = async () => {
      try {
        // Get selected items from sessionStorage
        const storedSelection = sessionStorage.getItem(`selection_${eventId}`)
        if (!storedSelection) {
          console.error("No selection found in storage")
          return
        }

        const selectedItems = JSON.parse(storedSelection)
        
        // Get customer name from URL params or use default
        const urlParams = new URLSearchParams(window.location.search)
        const customerName = urlParams.get('customer') || urlParams.get('name') || "Customer"
        
        // Submit selection to API
        await api.events.submitSelection(eventId, {
          selectedItems,
          customerName
        })
        
        setSubmitted(true)
        // Clear storage after submission
        sessionStorage.removeItem(`selection_${eventId}`)
      } catch (error) {
        console.error("Failed to submit selection:", error)
      }
    }

    if (eventId && !submitted) {
      submitSelection()
    }
  }, [eventId, submitted])

  // Prevent back navigation
  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
    }

    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // Confetti Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Confetti particles
    const confettiColors = ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#ef4444']
    
    for (let i = 0; i < 200; i++) {
      confettiRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        width: Math.random() * 10 + 5,
        height: Math.random() * 10 + 5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    // Fireworks
    const createFirework = (x: number, y: number) => {
      const colors = ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6']
      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50
        const speed = Math.random() * 5 + 2
        fireworksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 60,
          maxLife: 60,
        })
      }
    }

    // Initial fireworks
    setTimeout(() => createFirework(canvas.width * 0.2, canvas.height * 0.3), 500)
    setTimeout(() => createFirework(canvas.width * 0.8, canvas.height * 0.4), 1000)
    setTimeout(() => createFirework(canvas.width * 0.5, canvas.height * 0.2), 1500)
    setTimeout(() => createFirework(canvas.width * 0.3, canvas.height * 0.5), 2000)
    setTimeout(() => createFirework(canvas.width * 0.7, canvas.height * 0.3), 2500)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw confetti
      confettiRef.current.forEach((confetti, index) => {
        ctx.save()
        ctx.translate(confetti.x, confetti.y)
        ctx.rotate((confetti.rotation * Math.PI) / 180)
        ctx.fillStyle = confetti.color
        ctx.fillRect(-confetti.width / 2, -confetti.height / 2, confetti.width, confetti.height)
        ctx.restore()

        confetti.x += confetti.speedX
        confetti.y += confetti.speedY
        confetti.rotation += confetti.rotationSpeed

        if (confetti.y > canvas.height) {
          confetti.y = -10
          confetti.x = Math.random() * canvas.width
        }
      })

      // Draw fireworks
      fireworksRef.current.forEach((firework, index) => {
        ctx.fillStyle = firework.color
        ctx.globalAlpha = firework.life / firework.maxLife
        ctx.beginPath()
        ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2)
        ctx.fill()

        firework.x += firework.vx
        firework.y += firework.vy
        firework.life--

        if (firework.life <= 0) {
          fireworksRef.current.splice(index, 1)
        }
      })

      ctx.globalAlpha = 1
      requestAnimationFrame(animate)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 relative overflow-hidden">
      {/* Canvas for Confetti and Fireworks */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-8 animate-in zoom-in duration-1000">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-200 rounded-full animate-ping opacity-75" />
            <div className="absolute inset-0 bg-pink-300 rounded-full animate-pulse" />
            <div className="relative bg-gradient-to-br from-pink-400 to-rose-400 rounded-full p-8 shadow-2xl">
              <CheckCircle2 className="h-20 w-20 text-white" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center animate-in slide-in-from-bottom-4 duration-1000">
          Congratulations!
        </h1>

        <div className="flex items-center justify-center gap-3 mb-8 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Sparkles className="h-8 w-8 text-amber-400 animate-pulse" />
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 text-center">
            Your Selection Has Been Confirmed
          </p>
          <Sparkles className="h-8 w-8 text-amber-400 animate-pulse" />
        </div>

        {/* Wedding Message Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border-2 border-pink-200 shadow-xl max-w-2xl animate-in slide-in-from-bottom-4 duration-1000 delay-500">
          <p className="text-xl text-gray-700 mb-4 leading-relaxed text-center">
            Thank you for choosing your special Kerala wedding memories with us!
          </p>
          <p className="text-lg text-gray-600 leading-relaxed text-center">
            We're thrilled to be part of your journey. Your selection has been received and our team will contact you shortly to finalize the details.
          </p>
        </div>

        {/* Blessing Message */}
        <div className="mb-10 animate-in slide-in-from-bottom-4 duration-1000 delay-700">
          <p className="text-3xl md:text-4xl font-bold text-rose-600 mb-3 text-center">
            🎉 Happy Married Life! 🎉
          </p>
          <p className="text-xl text-gray-600 italic text-center max-w-xl">
            May your marriage be filled with love, laughter, and countless beautiful memories
          </p>
        </div>

        {/* Floating Hearts */}
        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0s' }}>
          <Heart className="h-8 w-8 text-pink-300 fill-pink-300" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '0.3s' }}>
          <Heart className="h-6 w-6 text-rose-300 fill-rose-300" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce" style={{ animationDelay: '0.6s' }}>
          <Heart className="h-7 w-7 text-pink-300 fill-pink-300" />
        </div>
        <div className="absolute bottom-60 right-16 animate-bounce" style={{ animationDelay: '0.9s' }}>
          <Heart className="h-6 w-6 text-rose-300 fill-rose-300" />
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => router.push('/')}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-10 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-bottom-4 duration-1000 delay-1000"
        >
          <Home className="mr-2 h-5 w-5" />
          Go to Home
        </Button>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 bg-rose-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* Side Decorations */}
      <div className="absolute top-1/4 left-4 transform -rotate-12 opacity-20 text-5xl z-10">
        🌺
      </div>
      <div className="absolute top-1/3 right-6 transform rotate-12 opacity-20 text-5xl z-10">
        🌼
      </div>
      <div className="absolute bottom-1/4 left-6 transform rotate-12 opacity-20 text-5xl z-10">
        🌸
      </div>
      <div className="absolute bottom-1/3 right-4 transform -rotate-12 opacity-20 text-5xl z-10">
        🌹
      </div>
    </div>
  )
}


