import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import ClientProvider from '@/components/ClientProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lifestyle Planner",
  description: "Create your personalized lifestyle plan including professional, fitness, hobbies, and nutrition goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <ClientProvider>
          <div className="min-h-screen">
            <header className="bg-white shadow-sm">
              <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex-shrink-0">
                    <Link href="/" className="cursor-pointer">
                      <h1 className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
                        Lifestyle Planner
                      </h1>
                    </Link>
                  </div>
                </div>
              </nav>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
