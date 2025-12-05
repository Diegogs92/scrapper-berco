import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Análisis de Precios - Scraper Berco",
  description: "Sistema de análisis de precios de la competencia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
