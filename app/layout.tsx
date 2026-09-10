import type { Metadata } from "next";
import { Barlow, Barlow_Semi_Condensed } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import WrenchCursor from "@/components/WrenchCursor";
import IntroSplash from "@/components/IntroSplash";
import { ICON_SRC } from "@/data/media";
import "./globals.css";


const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  variable: "--font-barlow-semi-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Chamo Import",
  description: "Importaciones mayoristas y distribución en todo el Perú",
  icons: {
    icon: [{ url: ICON_SRC, type: "image/png" }],
    apple: [{ url: ICON_SRC }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlow.variable} ${barlowSemiCondensed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <WrenchCursor />
              <IntroSplash />
              <div className="flex min-h-full flex-1 flex-col">{children}</div>
              <Footer />
              <WhatsAppFloat />
              <AuthModal />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
