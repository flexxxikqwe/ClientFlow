"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="w-full max-w-md p-8 rounded-3xl border border-destructive/20 bg-destructive/5 backdrop-blur-sm space-y-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An unexpected error occurred. We&apos;ve been notified and are looking into it.
              </p>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="p-4 rounded-xl bg-black/5 text-left overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-destructive break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <Button 
              onClick={() => window.location.reload()}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reload Application
            </Button>
          </div>
        </div>
      )
    }

    return this.children
  }
}
