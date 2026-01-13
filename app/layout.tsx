
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header/page";
import Footer from "@/components/Footer/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MosalaFlow - Gestion de tâches simple et efficace",
  description: "Organisez votre travail et boostez votre productivité",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}