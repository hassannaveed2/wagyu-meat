import { Figtree, Fraunces } from "next/font/google";

// The /v2 landing page pairs a soft serif with a geometric sans; Japanese falls back to the site's JP faces.
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

export const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
