import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparar | Chamo Import",
  description: "Compara hasta 3 productos mayoristas lado a lado",
};

export default function CompararLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
