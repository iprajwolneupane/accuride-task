import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import ApolloClientProvider from "@/providers/ApolloProvider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import I18nProvider from "@/providers/I18nProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accuride Tasks",
  description: "Modern task management with multilingual support and calendar scheduling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var theme=localStorage.getItem("theme");if(theme==="dark"||theme==="light"){document.documentElement.classList.toggle("dark",theme==="dark")}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background" suppressHydrationWarning>
        <ClerkProvider>
          <ApolloClientProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
            <Toaster />
          </ApolloClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
