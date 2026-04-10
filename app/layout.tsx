import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import { getProfile } from "@/lib/sanity.queries";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Academic Website",
  description: "Academic research and publications",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar name={profile?.name || "My Site"} cvUrl={profile?.cvFile?.asset?.url} />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
