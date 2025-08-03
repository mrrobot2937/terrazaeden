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
