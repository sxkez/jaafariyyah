import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "𝘼𝙡 𝙅𝙖‘𝙛𝙖𝙧𝙞𝙮𝙮𝙖 (الجعفرية)",
  description: "Ja‘farī (Twelver Shi‘i) scholarship that meets the inquisitive heart.",
  openGraph: {
    title: "Al Ja‘fariyya – Twelver Shi‘i Community",
    description:
      "Learn, share, and connect around the teachings of the Ahl al-Bayt (a). A hub for students and seekers of Shi‘i knowledge.",
    url: "https://your-domain.com",
    siteName: "Al Ja‘fariyya",
    images: [
      {
        url: "https://imgur.com/a/ySl8qpG",
        width: 1200,
        height: 630,
        alt: "Al Ja‘fariyya Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al Ja‘fariyya – Twelver Shi‘i Community",
    description:
      "Explore resources on Shi‘i theology, fiqh, hadith, and spirituality with fellow students of knowledge.",
    images: ["https://ext.same-assets.com/4138622892/og-jafariyya.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Sidebar stays consistent */}
            <Sidebar />
            
            {/* Dynamic page content */}
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
