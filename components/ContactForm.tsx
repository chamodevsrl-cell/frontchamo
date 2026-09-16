"use client";

import InboxLeadForm from "@/components/InboxLeadForm";

const topics = [
  { value: "cotizacion", label: "Cotización mayorista" },
  { value: "catalogo", label: "Consulta de catálogo" },
  { value: "visita", label: "Visita o despacho" },
  { value: "otro", label: "Otro" },
] as const;

export default function ContactForm() {
  return (
    <InboxLeadForm
      source="contacto"
      topics={topics}
      defaultTopic="cotizacion"
      kicker="Escríbenos"
      title="Mensaje por WhatsApp"
      subtitle="Completa el formulario: queda registrado en el panel y se abre el chat con tus datos. Sin espera de correo."
    />
  );
}
