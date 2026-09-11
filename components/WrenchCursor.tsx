"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Wrench } from "lucide-react";

function subscribePointer(onStoreChange: () => void) {
  const media = window.matchMedia("(hover: hover) and (pointer: fine)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getPointerSnapshot() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

const NON_TEXT_INPUT_TYPES = new Set([
  "checkbox",
  "radio",
  "range",
  "button",
  "submit",
  "reset",
  "file",
  "color",
  "image",
]);

/** true solo para campos donde se puede escribir (no checkboxes, botones, etc.). */
function isTextEntryElement(target: HTMLElement | null) {
  const field = target?.closest("input, textarea, [contenteditable='true']");
  if (!field) return false;
  if (field instanceof HTMLInputElement) {
    return !NON_TEXT_INPUT_TYPES.has(field.type);
  }
  return true;
}

export default function WrenchCursor() {
  const enabled = useSyncExternalStore(
    subscribePointer,
    getPointerSnapshot,
    () => false,
  );
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [isTextField, setIsTextField] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    function onMove(event: MouseEvent) {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);

      const target = event.target as HTMLElement | null;
      const textField = isTextEntryElement(target);
      setIsTextField(textField);
      const isInteractive = Boolean(
        target?.closest(
          "a, button, input, textarea, select, label, [role='button']",
        ),
      );
      setInteractive(isInteractive);
    }

    function onLeave() {
      setVisible(false);
    }

    function onDown() {
      setPressed(true);
    }

    function onUp() {
      setPressed(false);
    }

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
      style={{
        transform: isTextField
          ? `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
          : `translate3d(${position.x}px, ${position.y}px, 0) translate(-18%, -18%) rotate(${pressed ? -18 : interactive ? -8 : -28}deg) scale(${pressed ? 0.88 : interactive ? 1.12 : 1})`,
        opacity: visible ? 1 : 0,
        transition: "opacity 150ms ease, transform 80ms ease-out",
      }}
    >
      {isTextField ? (
        // Barra de texto (I-beam): el cursor nativo está oculto, así que hay que
        // marcar de otra forma que el campo bajo el mouse acepta escribir.
        <span className="relative flex h-8 w-8 items-center justify-center">
          <span className="h-5 w-[2.5px] rounded-full bg-brand-primary dark:bg-brand-gold" />
        </span>
      ) : (
        <span className="relative flex h-8 w-8 items-center justify-center drop-shadow-[0_2px_4px_rgba(11,53,84,0.35)]">
          <Wrench
            className="h-7 w-7 text-brand-dark dark:text-brand-gold"
            strokeWidth={2.25}
          />
          <span className="absolute inset-0 -z-10 rounded-full bg-brand-gold/25 blur-[2px]" />
        </span>
      )}
    </div>
  );
}
