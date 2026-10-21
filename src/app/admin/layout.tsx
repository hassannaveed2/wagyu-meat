import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "../globals.css";

const displayEn = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-en",
  display: "swap",
});
const sansEn = Inter({ subsets: ["latin"], variable: "--font-sans-en", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Admin · Wagyu Meat", template: "%s · Wagyu Meat Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={`${displayEn.variable} ${sansEn.variable}`}>
      <body>{children}</body>
    </html>
  );
}
