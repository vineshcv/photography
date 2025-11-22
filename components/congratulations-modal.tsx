"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Heart, Sparkles } from 'lucide-react'

interface CongratulationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CongratulationsModal({ isOpen, onClose }: CongratulationsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" 
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-2xl mx-4 bg-gradient-to-br from-pink-50 via-white to-rose-50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Garland Decoration - Top */}
        <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden">
          <div className="flex justify-center items-start pt-2">
            <div className="flex items-center gap-2">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    backgroundColor: i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#ec4899' : '#10b981',
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
          {/* Garland String */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-pink-400 to-emerald-400 opacity-30" />
        </div>

        {/* Garland Decoration - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
          <div className="flex justify-center items-end pb-2">
            <div className="flex items-center gap-2">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    backgroundColor: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#ec4899' : '#f59e0b',
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
          </div>
          {/* Garland String */}
          <div className="absolute bottom-8 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-pink-400 to-amber-400 opacity-30" />
        </div>

        {/* Content */}
        <div className="relative px-8 py-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-200 rounded-full animate-ping opacity-75" />
              <div className="relative bg-gradient-to-br from-pink-400 to-rose-400 rounded-full p-6 shadow-lg">
                <CheckCircle2 className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Hearts Animation */}
          <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0s' }}>
            <Heart className="h-6 w-6 text-pink-300 fill-pink-300" />
          </div>
          <div className="absolute top-32 right-16 animate-bounce" style={{ animationDelay: '0.3s' }}>
            <Heart className="h-5 w-5 text-rose-300 fill-rose-300" />
          </div>
          <div className="absolute bottom-24 left-20 animate-bounce" style={{ animationDelay: '0.6s' }}>
            <Heart className="h-4 w-4 text-pink-300 fill-pink-300" />
          </div>
          <div className="absolute bottom-32 right-12 animate-bounce" style={{ animationDelay: '0.9s' }}>
            <Heart className="h-5 w-5 text-rose-300 fill-rose-300" />
          </div>

          {/* Main Message */}
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-in slide-in-from-bottom-4 duration-500">
            Congratulations!
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
            <p className="text-xl md:text-2xl font-semibold text-gray-700">
              Your Selection Has Been Confirmed
            </p>
            <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
          </div>

          {/* Wedding Message */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-8 border-2 border-pink-200 shadow-lg">
            <p className="text-lg text-gray-700 mb-3 leading-relaxed">
              Thank you for choosing your special Kerala wedding memories with us!
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              We're thrilled to be part of your journey. Your selection has been received and our team will contact you shortly to finalize the details.
            </p>
          </div>

          {/* Blessing Message */}
          <div className="mb-8">
            <p className="text-2xl md:text-3xl font-bold text-rose-600 mb-2">
              🎉 Happy Married Life! 🎉
            </p>
            <p className="text-lg text-gray-600 italic">
              May your marriage be filled with love, laughter, and countless beautiful memories
            </p>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Close
          </Button>

          {/* Decorative Elements */}
          <div className="mt-8 flex justify-center gap-4">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-rose-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        {/* Side Decorations */}
        <div className="absolute top-1/4 left-4 transform -rotate-12">
          <div className="text-4xl opacity-20">🌺</div>
        </div>
        <div className="absolute top-1/3 right-6 transform rotate-12">
          <div className="text-4xl opacity-20">🌼</div>
        </div>
        <div className="absolute bottom-1/4 left-6 transform rotate-12">
          <div className="text-4xl opacity-20">🌸</div>
        </div>
        <div className="absolute bottom-1/3 right-4 transform -rotate-12">
          <div className="text-4xl opacity-20">🌹</div>
        </div>
      </div>
    </div>
  )
}




