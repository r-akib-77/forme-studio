import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  id,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${
        centered ? "md:flex-col md:items-center" : ""
      } ${className}`}
    >
      <div className={centered ? "max-w-2xl text-center" : "max-w-2xl"}>
        {eyebrow ? (
          <p className="eyebrow mb-3 flex items-center gap-2">
            {centered ? (
              <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
            ) : null}
            {eyebrow}
            {centered ? (
              <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
            ) : null}
          </p>
        ) : null}
        <h2 id={id} className="display-md text-ink">{title}</h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
