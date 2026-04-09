import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarketingHeader() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container flex h-20 items-center justify-between px-8 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-3 group transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">ClientFlow</span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-sm font-semibold">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/demo/dashboard" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Live Demo
          </Link>
          <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link>
          <Button asChild size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/20">
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
