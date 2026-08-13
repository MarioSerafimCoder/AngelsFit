import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og-series-v2.png", base).toString();
  return {
    metadataBase: base,
    title: "AngelsFit — Seu treino, seu ritmo",
    description: "Treinos pessoais, presença automática e progresso disponíveis mesmo offline.",
    applicationName: "AngelsFit",
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "AngelsFit" },
    formatDetection: { telephone: false },
    icons: {
      icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icon-512.png", sizes: "512x512", type: "image/png" }],
      shortcut: "/icon-192.png",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }, { url: "/apple-touch-icon-precomposed.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: "AngelsFit — Seu treino, seu ritmo",
      description: "Seu treino, sua presença e seu progresso — mesmo offline.",
      type: "website",
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "AngelsFit — Seu treino. Seu ritmo." }],
    },
    twitter: { card: "summary_large_image", title: "AngelsFit", description: "Seu treino. Sua presença. Seu ritmo.", images: [socialImage] },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f4f5ef" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-theme="dark"><body className={geist.variable}>{children}</body></html>;
}
