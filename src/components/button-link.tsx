import { AppLink } from "@/components/app-link";
import { buttonVariants } from "@/components/ui/button";
import {
  externalLinkRel,
  isOutboundHttpUrl,
  withOutboundRef,
} from "@/lib/outbound-attribution";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  href: string;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
};

export function ButtonLink({
  href,
  className,
  variant,
  size,
  children,
  external,
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const isExternal = external || isOutboundHttpUrl(href);
  const outboundHref = isExternal ? withOutboundRef(href) : href;

  if (isExternal) {
    return (
      <a
        href={outboundHref}
        className={classes}
        target="_blank"
        rel={externalLinkRel(href)}
      >
        {children}
      </a>
    );
  }

  return (
    <AppLink href={href} className={classes}>
      {children}
    </AppLink>
  );
}
