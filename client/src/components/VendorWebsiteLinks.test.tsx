import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import type { VendorResult } from "@shared/schema";
import { ResultsCards } from "./ResultsCards";
import { ResultsTable } from "./ResultsTable";

afterEach(cleanup);

const vendor: VendorResult = {
  company: "Example Vendor",
  profile: "IPS",
  actor: "Document Source",
  year: "2026",
  event: "Connectathon",
};

const views = [
  { name: "cards", Component: ResultsCards, expectedLinks: 2 },
  {
    name: "grouped cards",
    Component: (props: { results: VendorResult[] }) => <ResultsCards {...props} groupByCompany />,
    expectedLinks: 2,
  },
  { name: "table", Component: ResultsTable, expectedLinks: 1 },
];

describe.each(views)("$name vendor website safety", ({ Component, expectedLinks }) => {
  it.each([
    "javascript:alert(document.domain)",
    "JaVaScRiPt:alert(1)",
    " \n\tjavascript:alert(1)",
    "java\tscript:alert(1)",
    "java\nscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "ftp://example.com",
    "mailto:person@example.com",
    "//example.com",
    "/relative-path",
    "example.com",
    "https://",
    "https://[invalid",
    "not a URL",
    "   ",
    "",
    undefined,
  ])("renders %j without a navigation link", (website) => {
    const { container } = render(<Component results={[{ ...vendor, website }]} />);
    expect(container.querySelectorAll("a")).toHaveLength(0);
    expect(container.textContent).toContain(vendor.company);
    if (website) {
      // Card views preserve the existing abbreviated website text.
      if (expectedLinks === 2) {
        expect(container.textContent).toContain(website.substring(0, 25));
      }
    }
  });

  it.each([
    "https://example.com/path?q=value#section",
    "http://example.com/",
    "HTTPS://EXAMPLE.COM/path",
    "  https://example.com/path  ",
  ])("keeps %j clickable with safe new-tab attributes", (website) => {
    const { container } = render(<Component results={[{ ...vendor, website }]} />);
    const links = Array.from(container.querySelectorAll("a"));
    expect(links).toHaveLength(expectedLinks);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe(new URL(website).href);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("validates every vendor website independently", () => {
    const { container } = render(
      <Component results={[
        { ...vendor, website: "javascript:alert(1)" },
        { ...vendor, company: "Safe Vendor", website: "https://example.com/" },
      ]} />,
    );
    const links = Array.from(container.querySelectorAll("a"));
    expect(links).toHaveLength(expectedLinks);
    expect(links.every((link) => link.getAttribute("href") === "https://example.com/")).toBe(true);
    expect(container.textContent).toContain(vendor.company);
  });
});
