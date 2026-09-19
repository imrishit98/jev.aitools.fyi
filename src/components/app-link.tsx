import type { AnchorHTMLAttributes, ReactNode } from "react";

export function AppLink({
  href,
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}
