import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function RegisterPage() {
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
      
      <div className="p-1 rounded-3xl bg-gradient-to-b from-border/50 to-transparent">
        <div className="p-8 rounded-[1.4rem] bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl shadow-primary/5">
          <RegisterForm />
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
