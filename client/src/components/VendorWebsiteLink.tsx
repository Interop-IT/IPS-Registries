import type { ReactNode } from "react";

interface VendorWebsiteLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}

/** Treat spreadsheet websites as untrusted: only absolute HTTP(S) URLs are links. */
export function VendorWebsiteLink({
  href,
  children,
  className,
  "data-testid": testId,
}: VendorWebsiteLinkProps) {
  let safeUrl: string | undefined;
  try {
    const url = new URL(href);
    if (url.protocol === "http:" || url.protocol === "https:") {
      safeUrl = url.href;
    }
  } catch {
    // Missing schemes and malformed addresses are displayed without navigation.
  }

  if (!safeUrl) {
    return <span data-testid={testId?.replace(/^link-/, "text-")}>{children}</span>;
  }

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-testid={testId}
    >
      {children}
    </a>
  );
}
