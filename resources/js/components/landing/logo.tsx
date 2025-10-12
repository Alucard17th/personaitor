// components/brand/logo.tsx
import * as React from "react";
import clsx from "clsx";

type Variant = "full" | "mark" | "wordmark" | "app";

export function Logo({
  variant = "full",
  className,
  title = "Personaitor",
}: {
  variant?: Variant;
  className?: string;
  title?: string;
}) {
  if (variant === "mark") return <LogoMark className={className} title={title} />;
  if (variant === "wordmark") return <LogoWordmark className={className} title={title} />;
  if (variant === "app") return <LogoApp className={className} title={title} />
  return <LogoFull className={className} title={title} />;
}

function LogoFull({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 360 96"
      role="img"
      aria-label={title}
      className={clsx("h-8 w-auto", className)}
    >
      <title>{title}</title>
      <defs>
        {/* Uses your OKLCH CSS variables */}
        <linearGradient id="p_grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--primary)" }} />
          <stop offset="100%" style={{ stopColor: "var(--chart-1)" }} />
        </linearGradient>
      </defs>

      {/* === LOGOMARK (left) === */}
      <g transform="translate(8,8)">
        {/* P stem */}
        <rect x="8" y="8" width="14" height="64" rx="7" fill="url(#p_grad)" />

        {/* P bowl (donut) */}
        <circle cx="48" cy="28" r="20" fill="url(#p_grad)" />
        <circle cx="48" cy="28" r="10.5" fill="var(--surface-1)" />

        {/* AI spark (accent diamond) */}
        <rect
          x="62"
          y="8"
          width="10"
          height="10"
          rx="2"
          transform="rotate(45 67 13)"
          fill="var(--accent)"
        />
      </g>

      {/* divider for spacing when very small */}
      <rect x="96" y="16" width="1" height="64" fill="var(--border)" opacity="0.4" />

      {/* === WORDMARK (right) === */}
      <g transform="translate(112,0)">
        <text
          x="0"
          y="58"
          fontFamily="ui-sans-serif, system-ui, Inter, Segoe UI, Roboto, Helvetica, Arial"
          fontWeight="800"
          fontSize="40"
          letterSpacing="0.5"
          fill="var(--primary)"
        >
          Personaitor
        </text>
        {/* subtle underline “ring” accent */}
        <rect x="2" y="66" width="210" height="4" rx="2" fill="var(--ring)" opacity="0.22" />
      </g>
    </svg>
  );
}

function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label={title}
      className={clsx("h-10 w-10", className)}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="p_grad_mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--primary)" }} />
          <stop offset="100%" style={{ stopColor: "var(--chart-1)" }} />
        </linearGradient>
      </defs>

      {/* P stem */}
      <rect x="16" y="16" width="16" height="64" rx="8" fill="url(#p_grad_mark)" />
      {/* P bowl */}
      <circle cx="56" cy="32" r="22" fill="url(#p_grad_mark)" />
      <circle cx="56" cy="32" r="12" fill="var(--surface-1)" />
      {/* AI spark */}
      <rect
        x="72"
        y="12"
        width="12"
        height="12"
        rx="2.5"
        transform="rotate(45 78 18)"
        fill="var(--accent)"
      />
    </svg>
  );
}

function LogoWordmark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 260 80"
      role="img"
      aria-label={title}
      className={clsx("h-8 w-auto", className)}
    >
      <title>{title}</title>
      <text
        x="0"
        y="52"
        fontFamily="ui-sans-serif, system-ui, Inter, Segoe UI, Roboto, Helvetica, Arial"
        fontWeight="800"
        fontSize="40"
        letterSpacing="0.5"
        fill="var(--primary)"
      >
        Personaitor
      </text>
      <rect x="2" y="60" width="190" height="4" rx="2" fill="var(--ring)" opacity="0.22" />
    </svg>
  );
}

function LogoApp({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 360 96"
      role="img"
      aria-label={title}
      className={clsx("h-8 w-auto", className)}
      style={{ width: "150px", height: "100px" }}
    >
      <title>{title}</title>
      <defs>
        {/* Uses your OKLCH CSS variables */}
        <linearGradient id="p_grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--primary)" }} />
          <stop offset="100%" style={{ stopColor: "var(--chart-1)" }} />
        </linearGradient>
      </defs>

      {/* === LOGOMARK (left) === */}
      <g transform="translate(8,8)">
        {/* P stem */}
        <rect x="8" y="8" width="14" height="64" rx="7" fill="url(#p_grad)" />

        {/* P bowl (donut) */}
        <circle cx="48" cy="28" r="20" fill="url(#p_grad)" />
        <circle cx="48" cy="28" r="10.5" fill="var(--surface-1)" />

        {/* AI spark (accent diamond) */}
        <rect
          x="62"
          y="8"
          width="10"
          height="10"
          rx="2"
          transform="rotate(45 67 13)"
          fill="var(--accent)"
        />
      </g>

      {/* divider for spacing when very small */}
      <rect x="96" y="16" width="1" height="64" fill="var(--border)" opacity="0.4" />

      {/* === WORDMARK (right) === */}
      <g transform="translate(112,0)">
        <text
          x="0"
          y="58"
          fontFamily="ui-sans-serif, system-ui, Inter, Segoe UI, Roboto, Helvetica, Arial"
          fontWeight="800"
          fontSize="40"
          letterSpacing="0.5"
          fill="var(--primary)"
        >
          Personaitor
        </text>
        {/* subtle underline “ring” accent */}
        <rect x="2" y="66" width="210" height="4" rx="2" fill="var(--ring)" opacity="0.22" />
      </g>
    </svg>
  );
}
