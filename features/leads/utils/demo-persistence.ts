"use client"

import { Lead } from "@/types/leads"
import { DEMO_LEADS } from "@/lib/demo-data"

const STORAGE_KEY = "clientflow_demo_leads"

/**
 * Gets leads from localStorage or initializes with DEMO_LEADS
 */
export const getStoredDemoLeads = (): Lead[] => {
  if (typeof window === 'undefined') return DEMO_LEADS as Lead[];
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_LEADS))
    return DEMO_LEADS as Lead[]
  }

  try {
    return JSON.parse(stored)
  } catch (e) {
    console.error("Failed to parse stored demo leads", e)
    return DEMO_LEADS as Lead[]
  }
}

/**
 * Persists leads to localStorage
 */
export const setStoredDemoLeads = (leads: Lead[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

/**
 * Resets demo data to initial state
 */
export const resetDemoLeads = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY)
}
