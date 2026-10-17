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
  title: "Capital em Movimento | XP",
  description:
    "Investimentos, planejamento e solucoes financeiras para diferentes momentos da sua jornada.",
  applicationName: "XP Capital em Movimento",
  metadataBase: new URL("https://www.xpi.com.br"),
  openGraph: {
    title: "Capital em Movimento | XP",
    description:
      "Uma experiencia digital sobre o ecossistema de investimentos, planejamento e solucoes financeiras da XP.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0b0b",
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
