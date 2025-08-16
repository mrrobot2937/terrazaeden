import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Terraza Eden - Plazoleta de Comidas",
  description: "Un paraíso gastronómico donde los sabores se encuentran. Descubre nuestras marcas exclusivas: Ay Wey!, Mazorca, Cocos Pacífico Fresh, Sabor Extremo Gourmet, Choripam, Togoima y Dream Burger.",
  keywords: ["terraza eden", "plazoleta de comidas", "gastronomía", "restaurantes", "comida"],
  authors: [{ name: "Terraza Eden" }],
  creator: "Terraza Eden",
  publisher: "Terraza Eden",
  icons: {
    icon: [
      {
        url: "https://terrazaedenfiles.s3.us-east-2.amazonaws.com/togoima/terrazaeledenlogo.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://terrazaedenfiles.s3.us-east-2.amazonaws.com/togoima/terrazaeledenlogo.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://terrazaedenfiles.s3.us-east-2.amazonaws.com/togoima/terrazaeledenlogo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "https://terrazaedenfiles.s3.us-east-2.amazonaws.com/togoima/terrazaeledenlogo.png",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "Terraza Eden - Plazoleta de Comidas",
    description: "Un paraíso gastronómico donde los sabores se encuentran. Descubre nuestras marcas exclusivas.",
    url: "https://terrazaeden.vercel.app",
    siteName: "Terraza Eden",
    images: [
      {
        url: "https://terrazaedenfiles.s3.us-east-2.amazonaws.com/togoima/terrazaeledenlogo.png",
        width: 1200,
        height: 630,
        alt: "Terraza Eden Logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terraza Eden - Plazoleta de Comidas",
    description: "Un paraíso gastronómico donde los sabores se encuentran.",
    images: ["https://terrazaedenfiles.s3.us-east-2.amazonaws.com/togoima/terrazaeledenlogo.png"],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a1a2e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
