// app/components/ui/marquee.ts
import * as React from "react";
import clsx from "clsx";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
};

const CSS = `
.marquee{--gap:2rem;--duration:30s;position:relative;overflow:hidden;width:100%}
.marquee__track{display:flex;width:max-content;gap:var(--gap);will-change:transform;animation:marquee var(--duration) linear infinite}
.marquee--reverse .marquee__track{animation-direction:reverse}
.marquee--pause-on-hover:hover .marquee__track{animation-play-state:paused}
.marquee__content{display:inline-flex;gap:var(--gap);align-items:stretch}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
`;

function ensureStylesInjected() {
  if (typeof document === "undefined") return;
  const id = "marquee-styles";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = CSS;
    document.head.appendChild(style);
  }
}

export default function Marquee({
  children,
  className,
  pauseOnHover,
  reverse,
}: MarqueeProps): React.ReactElement {
  // Inject CSS once on client
  React.useEffect(() => {
    ensureStylesInjected();
  }, []);

  const wrapperClass = clsx(
    "marquee",
    pauseOnHover && "marquee--pause-on-hover",
    reverse && "marquee--reverse",
    className
  );

  // Duplicate children to create seamless loop
  const contentDup = React.createElement(
    "div",
    { className: "marquee__content", "aria-hidden": true },
    children
  );

  return React.createElement(
    "div",
    { className: wrapperClass },
    React.createElement(
      "div",
      { className: "marquee__track" },
      React.createElement("div", { className: "marquee__content" }, children),
      contentDup
    )
  );
}
