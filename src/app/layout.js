import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Shared/Navbar/Navbar";
import Footer from "@/components/Shared/Footer/Footer";
import SessionProvider from "@/providers/NextAuthSessionProvider";
import QueryProvider from "@/providers/QueryProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Goal Khobor",
  description: "Generated by create next app",
  icons: {
    icon: "https://i.ibb.co/fV684RGm/goal-khobor.png",
    shortcut: "https://i.ibb.co/fV684RGm/goal-khobor.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <NextTopLoader
              color="linear-gradient(to right, rgb(229, 231, 235), rgb(156, 163, 175), rgb(37, 42, 49))"
              height={3}
              crawlSpeed={200}
              showSpinner={false}
              easing="ease"
              speed={300}
            />
            <Toaster position="top-right" />
            <Navbar />
            {children}
            <Footer />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
