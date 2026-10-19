"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = "idle" | "error" | "success";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setStatus("error");
      setMessage("Enter your email address to continue.");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setStatus("error");
      setMessage("That email address does not look right. Please check it.");
      return;
    }

    setStatus("success");
    setMessage(
      "Demo signup captured in your browser only — nothing was sent or stored on a server.",
    );
    setEmail("");
  }

  return (
    <section aria-labelledby="newsletter-heading" className="border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <p className="mb-3 flex items-center gap-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-lime">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" />
              The list
            </p>
            <h2 id="newsletter-heading" className="display-md text-paper">
              First look, every drop.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/65">
              New arrivals, restocks and the occasional studio note. One email when there
              is something worth opening.
            </p>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} noValidate className="max-w-xl">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status !== "idle") {
                      setStatus("idle");
                      setMessage("");
                    }
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={status === "error"}
                  aria-describedby="newsletter-message"
                  className={`h-12 w-full border bg-transparent px-4 text-sm text-paper outline-none transition-colors placeholder:text-paper/40 focus:border-lime ${
                    status === "error" ? "border-red-400" : "border-paper/25"
                  }`}
                />
                <button type="submit" className="btn btn-lime h-12 shrink-0 sm:w-auto">
                  Subscribe
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <p
                id="newsletter-message"
                role="status"
                aria-live="polite"
                className={`mt-3 flex items-start gap-2 text-xs leading-relaxed ${
                  status === "error"
                    ? "text-red-300"
                    : status === "success"
                      ? "text-lime"
                      : "text-paper/50"
                }`}
              >
                {status === "success" ? (
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                ) : null}
                {message ||
                  "This is a demo interaction. Your address is validated in the browser and never transmitted."}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
