import { format } from "date-fns"

/**
 * Utility to convert an array of objects to a CSV string.
 * Handles escaping for commas, quotes, and line breaks.
 */
export function convertToCSV(data: any[], headers: { label: string; key: string | ((item: any) => any) }[]): string {
  const headerRow = headers.map(h => escapeCSV(h.label)).join(",");
  
  const rows = data.map(item => {
    return headers.map(h => {
      let value;
      if (typeof h.key === 'function') {
        value = h.key(item);
      } else {
        value = getNestedValue(item, h.key);
      }
      return escapeCSV(value);
    }).join(",");
  });

  return [headerRow, ...rows].join("\n");
}

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return "";
  
  let str = String(val).trim();
  
  // If the value contains a comma, newline, or double quote, it must be enclosed in double quotes.
  // Double quotes inside the value must be escaped by preceding them with another double quote.
  if (str.includes(",") || str.includes("\n") || str.includes("\"") || str.includes("\r")) {
    str = `"${str.replace(/"/g, "\"\"")}"`;
  }
  
  return str;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Triggers a browser download of a CSV file.
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Common Lead headers for CSV export
 */
export const LEAD_CSV_HEADERS = [
  { label: "Full Name", key: (l: any) => `${l.first_name} ${l.last_name}` },
  { label: "First Name", key: "first_name" },
  { label: "Last Name", key: "last_name" },
  { label: "Email", key: (l: any) => l.email || "N/A" },
  { label: "Phone", key: (l: any) => l.phone || "N/A" },
  { label: "Company", key: (l: any) => l.company || "Individual" },
  { label: "Status", key: (l: any) => l.status.toUpperCase() },
  { label: "Priority", key: (l: any) => l.priority?.toUpperCase() || "MEDIUM" },
  { label: "Value ($)", key: (l: any) => l.value ? l.value.toFixed(2) : "0.00" },
  { label: "Source", key: (l: any) => l.source || "Direct" },
  { label: "Created Date", key: (l: any) => l.created_at ? format(new Date(l.created_at), "yyyy-MM-dd HH:mm") : "N/A" },
  { label: "Last Updated", key: (l: any) => l.updated_at ? format(new Date(l.updated_at), "yyyy-MM-dd HH:mm") : "N/A" },
];
