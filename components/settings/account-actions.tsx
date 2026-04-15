"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Trash2, AlertTriangle, FileJson } from "lucide-react"
import { toast } from "sonner"
import { useLeads } from "@/features/leads/hooks/use-leads"
import { Lead } from "@/types/leads"
import { convertToCSV, downloadCSV, LEAD_CSV_HEADERS } from "@/lib/utils/csv"

export function AccountActions() {
  const [isExporting, setIsExporting] = useState(false)
  const { leads } = useLeads({ limit: 1000 }) // Fetch a large batch for export

  const handleExport = async () => {
    setIsExporting(true)
    toast.info("Preparing your data for export...")
    
    try {
      // Small delay to simulate processing for better UX feel
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (!leads || leads.length === 0) {
        toast.error("No data available to export")
        return
      }

      const csvContent = convertToCSV(leads, LEAD_CSV_HEADERS)
      const date = new Date().toISOString().split('T')[0]
      downloadCSV(csvContent, `clientflow-leads-export-${date}.csv`)
      
      toast.success("Data exported successfully!")
    } catch (error) {
      toast.error("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = () => {
    toast.error("Account deletion is disabled in this preview environment.")
  }

  return (
    <div className="p-8 rounded-3xl bg-card/30 border border-border/50 backdrop-blur-sm space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-rose-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Account Actions</h3>
          <p className="text-sm text-muted-foreground font-medium">Manage your data and account status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-secondary/10 border border-border/20 space-y-4">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-primary" />
            <h4 className="font-bold text-foreground">Export Data</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Download all your leads and activity history in CSV format for backup or external analysis.
          </p>
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full rounded-xl h-11 font-bold text-[10px] uppercase tracking-[0.2em] border-border/50"
          >
            {isExporting ? "Exporting..." : "Download CSV"}
          </Button>
        </div>

        <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 space-y-4">
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-destructive" />
            <h4 className="font-bold text-destructive">Delete Account</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Permanently remove your account and all associated data. This action cannot be undone.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            className="w-full rounded-xl h-11 font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-destructive/10"
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </div>
  )
}
