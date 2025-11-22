import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  href?: string
  showLink?: boolean
  width?: number
  height?: number
}

export function Logo({ className, href = "/", showLink = true, width = 160, height = 45 }: LogoProps) {
  const logoContent = (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/kerala-wedding-photos/logo.png"
        alt="Azores Interactive"
        width={width}
        height={height}
        className="h-10 w-auto max-h-12 object-contain"
        priority
      />
    </div>
  )

  if (showLink) {
    return (
      <Link href={href} className="flex items-center">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

