import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { VendorResult } from "@shared/schema";
import Home from "@/pages/Home";

const vendor: VendorResult = {
  company: "Example Vendor",
  product: "Example Product",
  primaryContact: "Example Person",
  contactInfo: "person@example.test",
  website: "https://example.test",
  status: "Production",
  event: "Example Event",
  year: "2026",
  actor: "Content Creator",
  profile: "",
};

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ data: [vendor], isLoading: false, error: null }),
}));
vi.mock("@/components/Header", () => ({ Header: () => null }));
vi.mock("@/components/Footer", () => ({ Footer: () => null }));

afterEach(cleanup);

describe("vendor registry", () => {
  it("shows all sheet columns in list and item views and searches by status", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "IPS Vendor Registry" })).toBeTruthy();
    const table = screen.getByRole("table");
    for (const column of ["Company", "Product Name", "Primary Contact", "Contact Email", "Primary Link", "Production / Development", "Validation Event", "Year", "Actor"]) {
      expect(within(table).getByRole("columnheader", { name: column })).toBeTruthy();
    }
    for (const value of ["Example Vendor", "Example Product", "Example Person", "person@example.test", "Production", "Example Event", "2026", "Content Creator"]) {
      expect(within(table).getByText(value)).toBeTruthy();
    }
    expect(within(table).getByRole("link", { name: "https://example.test" }).getAttribute("href"))
      .toBe("https://example.test/");

    fireEvent.click(screen.getByRole("button", { name: "Item View" }));
    expect(screen.getByText("Production / Development:")).toBeTruthy();
    expect(screen.getByText("Example Event")).toBeTruthy();
    const search = screen.getAllByPlaceholderText("Search by company, product, contact, or any field...")[0];
    fireEvent.change(search, { target: { value: "production" } });
    expect(screen.getByText("Example Event")).toBeTruthy();
    fireEvent.change(search, { target: { value: "nonexistent" } });
    expect(screen.getByText("No vendors found")).toBeTruthy();
  });
});
