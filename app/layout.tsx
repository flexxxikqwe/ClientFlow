import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/features/auth/context/user-context';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/layout/error-boundary';

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
        <ErrorBoundary>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">
                  {children}
                </main>
              </div>
              <Toaster position="top-center" richColors closeButton toastOptions={{
                className: "cursor-pointer",
              }} />
            </ThemeProvider>
          </UserProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
