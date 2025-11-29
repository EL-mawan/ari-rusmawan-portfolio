import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ari Rusmawan - Information Technology Education | Programmer | Adm. QA/QC | Project Expeditor",
  description: "Professional portfolio of Ari Rusmawan - Information Technology Education specialist, Programmer, QA/QC Administrator, and Project Expeditor with expertise in modern web development and project management.",
  keywords: ["Ari Rusmawan", "Information Technology Education", "Programmer", "QA/QC", "Project Expeditor", "Web Developer", "Portfolio", "IT Professional"],
  authors: [{ name: "Ari Rusmawan" }],
  openGraph: {
    title: "Ari Rusmawan - IT Professional Portfolio",
    description: "Information Technology Education specialist, Programmer, QA/QC Administrator, and Project Expeditor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ari Rusmawan - IT Professional Portfolio",
    description: "Information Technology Education specialist, Programmer, QA/QC Administrator, and Project Expeditor",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
