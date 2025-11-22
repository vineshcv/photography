import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { LandingHero } from "@/components/landing-hero"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, Layout, Users, Zap, CheckCircle2, X } from 'lucide-react'
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <LandingHero />

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-medium">Everything you need for Kerala wedding photography</h2>
              <p className="text-muted-foreground text-lg">
                Powerful tools designed to help you manage, organize, and deliver beautiful Kerala wedding memories with speed and traditional elegance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "AI Face Recognition",
                  description: "Automatically identify and tag people in your photos. Create personalized galleries for every guest in seconds.",
                },
                {
                  icon: Layout,
                  title: "Smart Layouts",
                  description: "Drag-and-drop template editor for creating stunning albums and social media collages effortlessly.",
                },
                {
                  icon: Zap,
                  title: "Instant Delivery",
                  description: "Share high-resolution downloads with clients immediately. Secure, fast, and professionally presented.",
                },
              ].map((feature, index) => (
                <div key={index} className="bg-background p-8 rounded-2xl border border-border/50 hover:border-primary/20 transition-colors shadow-sm">
                  <div className="h-12 w-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative aspect-square lg:aspect-[4/3] bg-muted rounded-2xl overflow-hidden shadow-xl">
                 <Image
                  src="/kerala-wedding-photos/1.jpg"
                  alt="Kerala Wedding Photography"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  Traditional Kerala Wedding
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
                <h2 className="font-serif text-3xl md:text-4xl font-medium">
                  From Kerala wedding shoot to delivery, <br />
                  <span className="italic text-muted-foreground">simplified.</span>
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      step: "01",
                      title: "Upload & Organize",
                      description: "Drag and drop your RAW or JPEG files. We handle the processing and organization automatically.",
                    },
                    {
                      step: "02",
                      title: "Tag & Sort",
                      description: "Our AI engine detects faces and groups photos by person, making it easy to find specific moments.",
                    },
                    {
                      step: "03",
                      title: "Design & Export",
                      description: "Use our template engine to create beautiful layouts, then export for print or web delivery.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-6">
                      <span className="font-mono text-sm text-muted-foreground pt-1">{item.step}</span>
                      <div>
                        <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-medium">Simple, transparent pricing</h2>
              <p className="text-muted-foreground text-lg">
                Choose the perfect plan for your Kerala wedding photography business. All plans include AI face recognition.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Basic Plan */}
              <div className="bg-background rounded-2xl border border-border/50 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-medium mb-2">Basic</h3>
                    <p className="text-muted-foreground text-sm mb-4">Perfect for getting started</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">Free</span>
                    </div>
                  </div>
                  
                  <Link href="/auth/register">
                    <Button className="w-full" variant="outline">
                      Get Started
                    </Button>
                  </Link>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">AI Face Recognition</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Unlimited photo uploads</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Basic galleries</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Up to 3 events per month</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Templating & Layouts</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Client Proofing</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Team collaboration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="bg-background rounded-2xl border-2 border-primary p-8 shadow-lg hover:shadow-xl transition-shadow relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-medium mb-2">Pro</h3>
                    <p className="text-muted-foreground text-sm mb-4">For professional photographers</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">₹2,999</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  
                  <Link href="/auth/register">
                    <Button className="w-full" size="lg">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Everything in Basic</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium">Templating & Layouts</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium">Client Proofing</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Unlimited events</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Kerala wedding templates</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">High-resolution exports</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Priority support</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Token distribution</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Plan */}
              <div className="bg-background rounded-2xl border border-border/50 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-medium mb-2">Team</h3>
                    <p className="text-muted-foreground text-sm mb-4">For studios and agencies</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">₹7,999</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  
                  <Link href="/auth/register">
                    <Button className="w-full" variant="outline" size="lg">
                      Contact Sales
                    </Button>
                  </Link>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Everything in Pro</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium">Token Distribution</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Up to 10 team members</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">10,000 tokens/month</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Assign tokens to team members</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Team analytics & reports</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Advanced permissions</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Dedicated account manager</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                All plans include a 14-day free trial. No credit card required.{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact us
                </Link>{" "}
                for custom enterprise plans.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section with Kerala Wedding Theme */}
        <section className="py-24 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
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
      </main>

      <footer className="py-12 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <Logo showLink={false} width={140} height={40} />
              <p className="text-sm text-muted-foreground">
                Professional tools for the modern photographer.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Azores Interactive. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
