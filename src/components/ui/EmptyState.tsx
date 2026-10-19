import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center border border-dashed border-line-strong bg-paper px-6 py-16 text-center ${className}`}
    >
      {icon ? (
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-bone text-ink">
          {icon}
        </span>
      ) : null}
      <h3 className="text-xl font-semibold tracking-tight text-ink">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
