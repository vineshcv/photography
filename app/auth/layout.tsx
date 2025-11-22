import Image from "next/image"
import { Logo } from "@/components/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding with Kerala Wedding Photography Image */}
      <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/kerala-wedding-photos/photography.png"
            alt="Kerala Wedding Photography"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        
        {/* Content */}
        <div className="relative z-10">
          <Logo href="/" width={200} height={56} />
        </div>
        <div className="space-y-6 relative z-10">
          <h1 className="font-serif text-4xl font-medium leading-tight text-white">
            Streamline your photography workflow with intelligent tools.
          </h1>
          <p className="text-white/90 text-lg">
            Join thousands of professional photographers who trust Azores Interactive for face tagging, gallery management, and client delivery.
          </p>
        </div>
        <div className="text-sm text-white/70 relative z-10">
          © {new Date().getFullYear()} Azores Interactive. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
