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

let vendorRows = [vendor];

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ data: vendorRows, isLoading: false, error: null }),
}));
vi.mock("@/components/Header", () => ({ Header: () => null }));
vi.mock("@/components/Footer", () => ({ Footer: () => null }));

afterEach(() => {
  cleanup();
  vendorRows = [vendor];
});

describe("vendor registry", () => {
  it("filters Actor using the Creator and Consumer choices", () => {
    vendorRows = [
      vendor,
      { ...vendor, company: "Consumer Vendor", actor: "content consumer" },
      { ...vendor, company: "No Actor Vendor", actor: "" },
    ];
    render(<Home />);
    fireEvent.click(screen.getByTestId("button-filter-actor"));
    fireEvent.click(screen.getByRole("option", { name: "Creator" }));
    expect(screen.getByTestId("text-results-count").textContent).toBe("Showing 1 entry");
    expect(within(screen.getByRole("table")).getByText("Example Vendor")).toBeTruthy();

    fireEvent.click(screen.getByRole("option", { name: "Consumer" }));
    expect(screen.getByTestId("text-results-count").textContent).toBe("Showing 2 entries");
    expect(within(screen.getByRole("table")).getByText("Consumer Vendor")).toBeTruthy();

    fireEvent.click(screen.getByTestId("button-clear-actor"));
    expect(screen.getByTestId("text-results-count").textContent).toBe("Showing 3 entries");
  });

  it("shows all sheet columns in list and item views and searches by status", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "IPS Vendor Registry" })).toBeTruthy();
    const table = screen.getByRole("table");
    for (const column of ["Company", "Product Name", "Primary Contact", "Contact Email", "Primary Link", "Status", "Validation Event", "Year", "Actor"]) {
      expect(within(table).getByRole("columnheader", { name: column })).toBeTruthy();
    }
    for (const value of ["Example Vendor", "Example Product", "Example Person", "person@example.test", "Production", "Example Event", "2026", "Content Creator"]) {
      expect(within(table).getByText(value)).toBeTruthy();
    }
    expect(within(table).getByRole("link", { name: "Link" }).getAttribute("href"))
      .toBe("https://example.test/");

    fireEvent.click(screen.getByRole("button", { name: "Item View" }));
    expect(screen.getByText("Status:")).toBeTruthy();
    expect(screen.getByText("Production")).toBeTruthy();
    expect(screen.getByText("Example Event")).toBeTruthy();
    const search = screen.getAllByPlaceholderText("Search by company, product, contact, or any field...")[0];
    fireEvent.change(search, { target: { value: "production" } });
    expect(screen.getByText("Example Event")).toBeTruthy();
    fireEvent.change(search, { target: { value: "nonexistent" } });
    expect(screen.getByText("No vendors found")).toBeTruthy();
  });
});
