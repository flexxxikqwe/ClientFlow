import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to your ClientFlow account</p>
      </div>
      
      <LoginForm />

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-sky-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
