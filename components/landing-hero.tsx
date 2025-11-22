import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Image from "next/image"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pb-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Capturing Kerala Wedding{" "}
                <span className="italic text-muted-foreground">Memories Forever</span>
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                Preserve your beautiful Malayalee wedding moments with AI-powered face tagging, elegant client galleries, and stunning Kerala-themed templates. Designed for photographers who capture Kerala's rich wedding traditions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>AI Face Recognition</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Unlimited Events</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Client Proofing</span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted shadow-2xl">
              <Image
                src="/kerala-wedding-photos/thali"
                alt="Kerala Wedding Thali"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              
              {/* Kerala Wedding Decorative Border */}
              <div className="absolute inset-0 border-4 border-amber-400/30 rounded-2xl" />
              
              {/* Floating UI Element Mockup with Kerala Touch */}
              <div className="absolute bottom-8 left-8 right-8 rounded-xl bg-background/95 p-4 shadow-lg backdrop-blur-sm border border-amber-400/20">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background bg-muted ring-2 ring-amber-400/30">
                        <Image
                          src={`/kerala-wedding-photos/faces/${i}`}
                          alt={`Kerala Wedding Guest ${i}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground ring-2 ring-amber-400/30">
                      +42
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Kerala Wedding Faces Tagged</p>
                    <p className="text-xs text-muted-foreground">Processed 842 photos in 3m</p>
                  </div>
                </div>
              </div>
              
              {/* Kerala Wedding Elements Overlay */}
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                Kerala Wedding
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
