import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Edesis Premium QR Code Generator | Ücretsiz QR Kod Oluşturucu",
  description: "Bağlantılarınızı saniyeler içinde profesyonel QR kodlara dönüştürün. Modern, hızlı ve tamamen ücretsiz QR kod oluşturucu.",
  keywords: ["qr kod", "qr code", "qr kod oluşturucu", "qr code generator", "ücretsiz qr kod"],
  authors: [{ name: "Edesis Premium QR Studio" }],
  creator: "Edesis Premium QR Studio",
  publisher: "Edesis Premium QR Studio",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://qr-studio.com",
    title: "Edesis Premium QR Code Generator",
    description: "Bağlantılarınızı saniyeler içinde profesyonel QR kodlara dönüştürün",
    siteName: "Edesis Premium QR Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edesis Premium QR Code Generator",
    description: "Bağlantılarınızı saniyeler içinde profesyonel QR kodlara dönüştürün",
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="73fa885b-56d3-4ed3-8e03-612cd13d6958"></script>
      </head>
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
