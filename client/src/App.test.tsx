import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("@/pages/Home", () => ({ default: () => <h1>Vendor Registry</h1> }));
vi.mock("@/pages/Implementations", () => ({ default: () => <h1>Implementation Registry</h1> }));

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

describe("registry routes", () => {
  it("opens the vendor registry at /vendors", () => {
    window.history.replaceState(null, "", "/vendors");
    render(<App />);
    expect(screen.getByRole("heading", { name: "Vendor Registry" })).toBeTruthy();
    expect(window.location.pathname).toBe("/vendors");
  });

  it("redirects the old results address to the vendor registry", async () => {
    window.history.replaceState(null, "", "/results");
    render(<App />);
    expect(await screen.findByRole("heading", { name: "Vendor Registry" })).toBeTruthy();
    expect(window.location.pathname).toBe("/vendors");
  });
});
