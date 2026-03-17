import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-muted-foreground">Join ClientFlow today</p>
      </div>
      
      <RegisterForm />

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
