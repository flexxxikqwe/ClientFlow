import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from 'sonner';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'ClientFlow | Modern CRM',
  description: 'Production-ready CRM SaaS for high-growth teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
              <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                <div className="flex items-center gap-2 font-bold text-xl">
                  <div className="w-8 h-8 bg-sky-600 rounded flex items-center justify-center text-white">CF</div>
                  <span>ClientFlow</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                  <Link href="#features" className="hover:text-sky-600 transition-colors">Features</Link>
                  <Link href="#pricing" className="hover:text-sky-600 transition-colors">Pricing</Link>
                  <Link href="/login" className="hover:text-sky-600 transition-colors">Login</Link>
                  <Link href="/register" className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors">Get Started</Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
