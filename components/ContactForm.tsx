"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/data/contact";

const topics = [
  { value: "cotizacion", label: "Cotización mayorista" },
  { value: "catalogo", label: "Consulta de catálogo" },
  { value: "visita", label: "Visita o despacho" },
  { value: "otro", label: "Otro" },
] as const;

const inputClass =
  "w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof topics)[number]["value"]>("cotizacion");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const topicLabel =
      topics.find((item) => item.value === topic)?.label ?? topic;
    const text = [
      `Hola, soy ${name}${company ? ` de ${company}` : ""}.`,
      `Teléfono: ${phone}`,
      email ? `Correo: ${email}` : null,
      `Asunto: ${topicLabel}`,
      "",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    openWhatsApp(text);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-brand-primary/25 bg-white p-5 shadow-[0_0_18px_rgba(18,126,201,0.12)] sm:p-6 dark:bg-[#102a40]"
    >
      <p className="text-sm font-bold tracking-wide text-brand-primary uppercase">
        Escríbenos
      </p>
      <h2 className="mt-1 font-display text-2xl font-extrabold text-brand-dark dark:text-white">
        Mensaje por WhatsApp
      </h2>
      <p className="mt-2 text-sm text-brand-dark/65 dark:text-white/65">
        Completa el formulario y se abre el chat con tus datos ya escritos. Sin
        espera de correo.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Nombre
          </span>
          <input
            required
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Empresa
          </span>
          <input
            name="company"
            autoComplete="organization"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Teléfono
          </span>
          <input
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
            Correo
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
          Asunto
        </span>
        <select
          name="topic"
          value={topic}
          onChange={(event) =>
            setTopic(event.target.value as (typeof topics)[number]["value"])
          }
          className={inputClass}
        >
          {topics.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block font-semibold text-brand-dark dark:text-white">
          Mensaje
        </span>
        <textarea
          required
          name="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Cuéntanos qué línea o volumen necesitas…"
          className={inputClass}
        />
      </label>

      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-whatsapp px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1ebe57] sm:w-auto"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        Enviar por WhatsApp
      </button>
    </form>
  );
}
