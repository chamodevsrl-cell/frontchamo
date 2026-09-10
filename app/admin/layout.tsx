import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin contenido | Chamo Import",
  description: "Edita banners y categorías de este navegador",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
