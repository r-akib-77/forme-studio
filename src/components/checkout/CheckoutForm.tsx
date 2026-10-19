"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowLeft, Loader2, Lock, ShoppingBag } from "lucide-react";

import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { useCart, type CartLine } from "@/components/providers/CartProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { districts } from "@/lib/data/site";
import {
  createDemoReference,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutValues,
} from "@/lib/checkout";
import { formatBDT } from "@/lib/format";

const paymentMethods = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay the courier when the parcel arrives.",
  },
  {
    id: "bkash",
    label: "bKash",
    description: "Illustrative option — no transfer can be made.",
  },
  {
    id: "nagad",
    label: "Nagad",
    description: "Illustrative option — no transfer can be made.",
  },
] as const;

const initialValues: CheckoutValues = {
  name: "",
  phone: "",
  address: "",
  district: "",
  note: "",
};

export function CheckoutForm() {
  const { lines, totals, isEmpty, hydrated, clearCart } = useCart();

  const [values, setValues] = useState<CheckoutValues>(initialValues);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [payment, setPayment] = useState<string>("cod");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [reference, setReference] = useState("");
  const [summary, setSummary] = useState<CheckoutValues>(initialValues);
  const [confirmedLines, setConfirmedLines] = useState<CartLine[]>([]);

  function update(field: CheckoutField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCheckout(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`checkout-${firstField}`)?.focus();
      return;
    }

    setStatus("submitting");
    // Simulated request — nothing leaves the browser.
    await new Promise((resolve) => window.setTimeout(resolve, 1100));
    setReference(createDemoReference());
    setSummary(values);
    setConfirmedLines(lines);
    setStatus("done");
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="h-8 w-48 animate-pulse bg-bone" aria-hidden="true" />
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="h-96 animate-pulse bg-bone lg:col-span-7" aria-hidden="true" />
          <div className="h-72 animate-pulse bg-bone lg:col-span-5" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <OrderConfirmation
        reference={reference}
        values={summary}
        lines={confirmedLines}
        payment={
          paymentMethods.find((method) => method.id === payment)?.label ?? "Cash on Delivery"
        }
      />
    );
  }

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <p className="eyebrow mb-3">Checkout</p>
        <h1 className="display-md mb-10 text-ink">Checkout</h1>
        <EmptyState
          icon={<ShoppingBag className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />}
          title="There is nothing to check out"
          description="Add a piece to your bag and the demo checkout will open up."
          action={
            <Link href="/collections/new-arrivals" className="btn btn-lime">
              Shop new arrivals
            </Link>
          }
        />
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <Link
        href="/cart"
        className="group mb-6 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
          aria-hidden="true"
        />
        Back to bag
      </Link>

      <p className="eyebrow mb-3">Demo checkout</p>
      <h1 className="display-md text-ink">Checkout</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Fill in the form to preview a complete order flow. Nothing is transmitted, no
        payment is taken and no order is created.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-7">
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="eyebrow mb-5">
              1 — Delivery details
            </h2>

            <div className="space-y-5">
              <Field
                id="checkout-name"
                label="Full name"
                error={errors.name}
                value={values.name}
                onChange={(value) => update("name", value)}
                autoComplete="name"
                placeholder="e.g. Nusrat Jahan"
              />
              <Field
                id="checkout-phone"
                label="Mobile number"
                error={errors.phone}
                value={values.phone}
                onChange={(value) => update("phone", value)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="01712345678"
                hint="A Bangladeshi mobile number — the courier will call before delivery."
              />
              <div>
                <label
                  htmlFor="checkout-address"
                  className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink"
                >
                  Delivery address
                </label>
                <textarea
                  id="checkout-address"
                  rows={3}
                  value={values.address}
                  onChange={(event) => update("address", event.target.value)}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? "checkout-address-error" : undefined}
                  placeholder="House, road, area"
                  className={`w-full border bg-paper px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted-2 focus:border-ink ${
                    errors.address ? "border-red-500" : "border-line"
                  }`}
                />
                {errors.address ? (
                  <p
                    id="checkout-address-error"
                    role="alert"
                    className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600"
                  >
                    <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {errors.address}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="checkout-district"
                  className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink"
                >
                  District / city
                </label>
                <select
                  id="checkout-district"
                  value={values.district}
                  onChange={(event) => update("district", event.target.value)}
                  aria-invalid={Boolean(errors.district)}
                  aria-describedby={errors.district ? "checkout-district-error" : undefined}
                  className={`h-12 w-full border bg-paper px-3.5 text-sm text-ink outline-none transition-colors focus:border-ink ${
                    errors.district ? "border-red-500" : "border-line"
                  }`}
                >
                  <option value="">Select a district</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district ? (
                  <p
                    id="checkout-district-error"
                    role="alert"
                    className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600"
                  >
                    <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {errors.district}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="checkout-note"
                  className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink"
                >
                  Order note <span className="font-normal normal-case text-muted">(optional)</span>
                </label>
                <textarea
                  id="checkout-note"
                  rows={2}
                  value={values.note}
                  onChange={(event) => update("note", event.target.value)}
                  placeholder="Landmark, delivery window, or anything the courier should know"
                  className="w-full border border-line bg-paper px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted-2 focus:border-ink"
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="payment-heading" className="mt-12">
            <h2 id="payment-heading" className="eyebrow mb-5">
              2 — Payment method
            </h2>
            <p className="mb-5 max-w-lg text-xs leading-relaxed text-muted">
              These options illustrate a storefront interface only. No payment gateway is
              connected, no account is created and no money can be transferred.
            </p>
            <fieldset>
              <legend className="sr-only">Payment method</legend>
              <ul className="space-y-2.5">
                {paymentMethods.map((method) => {
                  const active = payment === method.id;
                  return (
                    <li key={method.id}>
                      <label
                        className={`flex cursor-pointer items-start gap-3 border px-4 py-3.5 transition-colors ${
                          active
                            ? "border-ink bg-bone"
                            : "border-line hover:border-line-strong"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={active}
                          onChange={() => setPayment(method.id)}
                          className="mt-0.5 h-4 w-4 shrink-0 appearance-none rounded-full border border-line-strong bg-paper transition-colors checked:border-ink checked:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                        />
                        <span>
                          <span className="block text-sm font-medium text-ink">
                            {method.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {method.description}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </section>

          <div className="mt-10">
            <button type="submit" disabled={submitting} className="btn btn-lime w-full">
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Processing demo order…
                </>
              ) : (
                <>Place demo order · {formatBDT(totals.total)}</>
              )}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.68rem] text-muted-2">
              <Lock className="h-3 w-3" aria-hidden="true" />
              Demo submission — nothing leaves your browser.
            </p>
          </div>
        </form>

        <aside className="lg:col-span-5">
          <div className="border border-line bg-bone p-6 lg:sticky lg:top-24">
            <h2 className="eyebrow mb-5">Order summary</h2>
            <ul className="divide-y divide-line border-y border-line bg-paper px-4">
              {lines.map((line) => (
                <li key={line.lineId} className="flex items-center gap-4 py-3.5">
                  <span className="media-frame relative h-16 w-12 shrink-0">
                    <Image src={line.image} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {line.name}
                    </span>
                    <span className="mt-0.5 block text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                      {line.color} · Size {line.size} · Qty {line.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-medium tabular-nums text-ink">
                    {formatBDT(line.price * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium tabular-nums text-ink">
                  {formatBDT(totals.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Demo delivery</dt>
                <dd className="font-medium tabular-nums text-ink">
                  {totals.deliveryFee === 0 ? "Free" : formatBDT(totals.deliveryFee)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink">
                  Total payable
                </dt>
                <dd className="font-display text-xl font-semibold tabular-nums text-ink">
                  {formatBDT(totals.total)}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`h-12 w-full border bg-paper px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-2 focus:border-ink ${
          error ? "border-red-500" : "border-line"
        }`}
        {...rest}
      />
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
