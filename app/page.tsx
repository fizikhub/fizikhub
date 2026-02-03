"use client"

import { NeoButton } from "@/components/neo/NeoButton"
import { NeoCard } from "@/components/neo/NeoCard"
import { NeoBadge } from "@/components/neo/NeoBadge"
import { ArrowRight, BookOpen, Flame, Zap, Home, User, Search, Menu } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neo-white text-black font-sans pb-24">
      {/* Mobile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b-2 border-black bg-white px-4 py-3 shadow-neo-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-neo-yellow border-2 border-black flex items-center justify-center font-bold text-xl shadow-neo-xs">
            F
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">FIZIKHUB</span>
        </div>
        <NeoButton size="icon" variant="ghost" className="h-10 w-10">
          <Menu className="h-6 w-6" />
        </NeoButton>
      </nav>

      <main className="container mx-auto px-4 pt-20">
        {/* Hero Section */}
        <section className="mb-12 mt-8">
          <NeoBadge variant="neo-pink" className="mb-4">
            NEW: QUANTUM LEAP V2
          </NeoBadge>
          <h1 className="font-heading text-5xl font-black leading-[0.9] tracking-tight mb-6">
            SCIENCE <br />
            <span className="text-neo-purple bg-black text-white px-2">UNFILTERED</span>
          </h1>
          <p className="text-lg font-medium text-muted-foreground mb-8 max-w-md">
            Raw science explanations for curious minds. No fluff, just the good stuff.
          </p>
          <div className="flex gap-4">
            <NeoButton className="w-full text-base font-bold shadow-neo">
              Start Reading <ArrowRight className="ml-2 h-4 w-4" />
            </NeoButton>
            <NeoButton variant="outline" className="w-14 shrink-0 shadow-neo">
              <Search className="h-5 w-5" />
            </NeoButton>
          </div>
        </section>

        {/* Categories / Tags */}
        <section className="mb-10 overflow-x-auto pb-4 -mx-4 px-4 flex gap-3 no-scrollbar">
          {["Quantum", "Space", "Biology", "Tech", "Math", "History"].map((tag, i) => (
            <NeoButton
              key={tag}
              variant={i === 0 ? "default" : "outline"}
              size="sm"
              className="rounded-full px-6 shadow-neo-sm font-bold border-2"
            >
              #{tag}
            </NeoButton>
          ))}
        </section>

        {/* Featured Content Feed */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Flame className="h-6 w-6 text-neo-orange fill-current" />
              HOT TAKES
            </h2>
          </div>

          {/* Article Card 1 */}
          <NeoCard className="overflow-hidden">
            <div className="h-48 bg-neo-purple/20 border-b-2 border-black relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-16 w-16 text-neo-purple opacity-50 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <NeoBadge className="absolute top-4 left-4 bg-white" variant="neo-black">
                PHYSICS
              </NeoBadge>
            </div>
            <div className="p-5">
              <h3 className="font-heading text-2xl font-bold leading-tight mb-2">
                Why Time Travel is Probably Impossible
              </h3>
              <p className="text-muted-foreground font-medium mb-4 line-clamp-2">
                Grandfather paradoxes, wormholes, and why you can't kill your past self (even if you wanted to).
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-neo-yellow/30 px-2 py-1 rounded border-2 border-black/10">
                  5 MIN READ
                </span>
                <NeoButton size="sm" variant="ghost" className="hover:bg-neo-purple hover:text-white">
                  Read <ArrowRight className="ml-1 h-3 w-3" />
                </NeoButton>
              </div>
            </div>
          </NeoCard>

          {/* Article Card 2 */}
          <NeoCard className="overflow-hidden">
            <div className="h-48 bg-neo-cyan/20 border-b-2 border-black relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-neo-cyan opacity-50 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <NeoBadge className="absolute top-4 left-4 bg-white" variant="neo-black">
                SPACE
              </NeoBadge>
            </div>
            <div className="p-5">
              <h3 className="font-heading text-2xl font-bold leading-tight mb-2">
                The Great Filter: Are We Alone?
              </h3>
              <p className="text-muted-foreground font-medium mb-4 line-clamp-2">
                Fermi's paradox explained. Where are all the aliens? Maybe they're already dead.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-neo-yellow/30 px-2 py-1 rounded border-2 border-black/10">
                  8 MIN READ
                </span>
                <NeoButton size="sm" variant="ghost" className="hover:bg-neo-cyan hover:text-black">
                  Read <ArrowRight className="ml-1 h-3 w-3" />
                </NeoButton>
              </div>
            </div>
          </NeoCard>
        </section>
      </main>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 p-2 bg-black rounded-xl border-2 border-black shadow-neo-lg scale-90 sm:scale-100">
          <NeoButton variant="default" size="icon" className="rounded-lg shadow-none border-transparent bg-neo-yellow text-black hover:bg-white">
            <Home className="h-6 w-6" />
          </NeoButton>
          <NeoButton variant="ghost" size="icon" className="rounded-lg text-white hover:bg-white hover:text-black hover:shadow-none border-transparent">
            <Search className="h-6 w-6" />
          </NeoButton>
          <NeoButton variant="ghost" size="icon" className="rounded-lg text-white hover:bg-white hover:text-black hover:shadow-none border-transparent">
            <BookOpen className="h-6 w-6" />
          </NeoButton>
          <NeoButton variant="ghost" size="icon" className="rounded-lg text-white hover:bg-white hover:text-black hover:shadow-none border-transparent">
            <User className="h-6 w-6" />
          </NeoButton>
        </div>
      </div>
    </div>
  )
}
