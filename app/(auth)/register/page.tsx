import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { Sparkles, CheckCircle2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function RegisterContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "Professional"

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <div className="flex items-center gap-3 lg:hidden mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">ClientFlow</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Create account</h1>
        <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
          Join over 2,000+ teams and start scaling your sales pipeline today.
        </p>
      </div>

      {/* Plan Summary Card */}
      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Selected Plan</p>
            <p className="text-lg font-bold tracking-tight">{plan} Plan</p>
          </div>
          <Link href="/#pricing" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Change
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          <span>14-day free trial included</span>
        </div>
      </div>
      
      <div className="p-1 rounded-3xl bg-gradient-to-b from-border/50 to-transparent">
        <div className="p-8 rounded-[1.4rem] bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl shadow-primary/5">
          <RegisterForm plan={plan} />
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground/60">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12"><Sparkles className="h-8 w-8 animate-pulse text-primary/20" /></div>}>
      <RegisterContent />
    </Suspense>
  )
}
