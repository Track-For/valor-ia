import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gestão para Sellers Magalu | Valor IA",
  description:
    "Gestão financeira e contábil para sellers do Magalu.",
  applicationName: "Valor IA · Gestão para Sellers",
  metadataBase: new URL("https://valor-ia.com.br"),
  openGraph: {
    title: "Gestão para Sellers Magalu | Valor IA",
    description:
      "Gestão financeira e contábil para sellers do Magalu.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#1683c4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={cn(geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
