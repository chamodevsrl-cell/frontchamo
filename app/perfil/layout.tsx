import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi cuenta | Chamo Import",
  description: "Perfil, empresa, cotizaciones y favoritos de tu cuenta Chamo Import",
};

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
