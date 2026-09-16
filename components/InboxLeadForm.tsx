"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { openCmsWhatsapp } from "@/lib/cms";
import { useSiteContent } from "@/components/ContentProvider";
import { createClaim, createContact } from "@/services/adminApi";
import type { InboxMessage } from "@/types/admin";

export type LeadTopic = { value: string; label: string };

const inputClass =
  "w-full rounded-lg border border-brand-dark/15 px-3 py-2 text-sm outline-none focus:border-brand-primary dark:bg-brand-dark dark:text-white";

export default function InboxLeadForm({
  source,
  topics,
  kicker,
  title,
  subtitle,
  defaultTopic,
}: {
  source: InboxMessage["source"];
  topics: readonly LeadTopic[];
  kicker: string;
  title: string;
  subtitle: string;
  defaultTopic: string;
}) {
  const { footer } = useSiteContent();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(defaultTopic);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const topicLabel = topics.find((item) => item.value === topic)?.label ?? topic;
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

    try {
      const payload = {
        name,
        company,
        phone,
        email,
        topic: topicLabel,
        message,
        source,
      };
      if (source === "reclamacion") {
        await createClaim(payload);
      } else {
        await createContact(payload);
      }
      openCmsWhatsapp(footer, text);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar el mensaje.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="rounded-2xl border border-brand-primary/25 bg-white p-5 shadow-[0_0_18px_rgba(18,126,201,0.12)] sm:p-6 dark:bg-[#102a40]"
    >
      <p className="text-sm font-bold tracking-wide text-brand-primary uppercase">
        {kicker}
      </p>
      <h2 className="mt-1 font-display text-2xl font-extrabold text-brand-dark dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm text-brand-dark/65 dark:text-white/65">{subtitle}</p>

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
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
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
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={inputClass}
        />
      </label>

      {error ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-whatsapp px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2} />
        {pending ? "Guardando…" : "Enviar por WhatsApp"}
      </button>
    </form>
  );
}
