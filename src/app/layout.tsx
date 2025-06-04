import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { NextThemesProvider } from "@/services/providers/NextThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/services/providers/QueryProvider";
import NextTopLoader from "nextjs-toploader";
import bgImage from "@/assets/img/background-body-admin.jpg";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fastpect",
  description: "Fastpect is a fast and modern IOT Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} bg-gradient-to-r from-cyan-200 to-cyan-200 bg-center bg-no-repeat text-slate-700 `}
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <NextTopLoader color="#3b82f6" showSpinner={false} zIndex={2000} />
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
        </NextThemesProvider>
        <Toaster />
      </body>
    </html>
  );
}
