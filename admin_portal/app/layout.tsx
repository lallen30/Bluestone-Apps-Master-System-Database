import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceSocketProvider } from "./providers/ServiceSocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multi-App Admin Portal",
  description: "Manage multiple applications from one portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServiceSocketProvider />
        {children}
      </body>
    </html>
  );
}
