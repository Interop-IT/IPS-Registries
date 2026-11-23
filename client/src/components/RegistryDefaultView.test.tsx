import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Home from "@/pages/Home";
import Implementations from "@/pages/Implementations";

vi.mock("@tanstack/react-query", () => ({
  useQuery: ({ queryKey }: { queryKey: string[] }) => ({
    data: queryKey[0] === "/api/implementations"
      ? [{ jurisdiction: "Example" }]
      : [{ company: "Example", profile: "", actor: "", year: "", event: "" }],
    isLoading: false,
    error: null,
  }),
}));
vi.mock("@/components/Header", () => ({ Header: () => null }));
vi.mock("@/components/Footer", () => ({ Footer: () => null }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe.each([
  { name: "implementation", Page: Implementations },
  { name: "vendor", Page: Home },
])("$name registry default view", ({ Page }) => {
  it.each([
    { width: 767, active: "button-view-cards", inactive: "button-view-table" },
    { width: 768, active: "button-view-table", inactive: "button-view-cards" },
  ])("defaults appropriately at $width px and allows switching", ({ width, active, inactive }) => {
    vi.stubGlobal("innerWidth", width);
    vi.stubGlobal("matchMedia", () => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(<Page />);
    expect(screen.getByTestId(active).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId(inactive).getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(screen.getByTestId(inactive));
    expect(screen.getByTestId(inactive).getAttribute("aria-pressed")).toBe("true");
    vi.stubGlobal("innerWidth", width === 767 ? 768 : 767);
    fireEvent(window, new Event("resize"));
    expect(screen.getByTestId(inactive).getAttribute("aria-pressed")).toBe("true");
  });
});
