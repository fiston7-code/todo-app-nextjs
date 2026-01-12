import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App - Next.js",
  description: "Application de gestion de tâches",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}








// import { Geist, Geist_Mono } from "next/font/google";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
