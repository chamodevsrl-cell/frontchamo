"use client";

import InboxLeadForm from "@/components/InboxLeadForm";

const topics = [
  { value: "producto", label: "Producto / calidad" },
  { value: "despacho", label: "Despacho o plazos" },
  { value: "factura", label: "Factura o pago" },
  { value: "otro", label: "Otro" },
] as const;

export default function ClaimForm() {
  return (
    <InboxLeadForm
      source="reclamacion"
      topics={topics}
      defaultTopic="producto"
      kicker="Reclamo"
      title="Registrar reclamación"
      subtitle="Guardamos el reclamo en el panel y abrimos WhatsApp con el mismo texto para atenderte al momento."
    />
  );
}
