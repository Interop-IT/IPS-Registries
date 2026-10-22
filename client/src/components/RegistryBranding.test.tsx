import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";
import { Footer } from "./Footer";
import { Header } from "./Header";

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    data: { ipsReturnUrl: "https://international-patient-summary.net/content-all-ips/" },
  }),
}));

afterEach(() => {
  cleanup();
  document.documentElement.classList.remove("dark");
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("registry branding", () => {
  it("starts light despite saved dark mode or an OS dark preference", () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
    const matchMedia = vi.fn(() => ({ matches: true }));
    vi.stubGlobal("matchMedia", matchMedia);
    const { unmount } = render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    // Existing saved values are not changed or used.
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(matchMedia).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    unmount();
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    vi.unstubAllGlobals();
  });

  it("preserves one dynamic-year Interop copyright and links to IPS contact", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-06-01T12:00:00Z"));
    try {
      const { container } = render(<Footer />);
      expect(screen.getByTestId("link-powered-by-interop").textContent).toBe(
        "Powered by Interop.it | © 2031 Interop IT inc. All Rights Reserved.",
      );
      expect((container.textContent?.match(/©/g) ?? []).length).toBe(1);
      expect(container.querySelector("img")).toBeNull();
      expect(screen.getByText(/IPS Contact Information/).closest("a")?.getAttribute("href"))
        .toBe("https://international-patient-summary.net/contact/");
      for (const link of Array.from(container.querySelectorAll('a[href*="international-patient-summary.net"]'))) {
        expect(link.getAttribute("target")).toBeNull();
      }
    } finally {
      vi.useRealTimers();
    }
  });

  it("uses the IPS homepage logo and same-tab desktop and mobile return links", () => {
    render(<Header />);
    expect(screen.getByTestId("link-logo").getAttribute("href"))
      .toBe("https://international-patient-summary.net/");
    const desktop = screen.getByTestId("link-ips-return");
    expect(desktop.getAttribute("target")).toBeNull();
    fireEvent.click(screen.getByTestId("button-mobile-menu"));
    const mobile = screen.getByTestId("mobile-link-ips-return");
    expect(mobile.getAttribute("href")).toBe(desktop.getAttribute("href"));
    expect(mobile.getAttribute("target")).toBeNull();
  });
});
