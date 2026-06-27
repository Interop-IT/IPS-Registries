import type { ReactNode } from "react";
import { Table, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewMode = "table" | "cards";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  tableLabel: string;
  cardsLabel: string;
  // Visibility/styling class applied to the button labels (e.g. "sm:hidden").
  labelClassName?: string;
  // Button variant used for the active view (differs per screen).
  activeVariant: "secondary" | "default";
  // Classes for the toggle group container (border radius differs per screen).
  containerClassName: string;
  // Classes applied to each toggle button (layout differs per screen).
  buttonClassName: string;
  // Optional per-screen grouping control rendered before the toggle group.
  groupingControl?: ReactNode;
}

/**
 * Shared, configurable table/cards view-mode toggle used by both the Vendor
 * Results and IPS Implementation Registry screens. Styling (labels, active
 * variant, container/button classes) is parameterized per screen, and the
 * grouping control (a button on one screen, a switch on the other) is supplied
 * via the `groupingControl` slot so each screen keeps its exact appearance.
 *
 * @param viewMode - The currently selected view.
 * @param onChange - Callback invoked with the new view when a toggle is pressed.
 * @param tableLabel - Label for the table-view button.
 * @param cardsLabel - Label for the cards-view button.
 * @param labelClassName - Optional class applied to the button labels (e.g. "sm:hidden").
 * @param activeVariant - Button variant used for the active view.
 * @param containerClassName - Classes for the toggle-group container.
 * @param buttonClassName - Classes applied to each toggle button.
 * @param groupingControl - Optional per-screen grouping control rendered before the toggle.
 */
export function ViewModeToggle({
  viewMode,
  onChange,
  tableLabel,
  cardsLabel,
  labelClassName,
  activeVariant,
  containerClassName,
  buttonClassName,
  groupingControl,
}: Readonly<ViewModeToggleProps>) {
  return (
    <>
      {groupingControl}
      <div className={containerClassName}>
        <Button
          variant={viewMode === "table" ? activeVariant : "ghost"}
          size="sm"
          onClick={() => onChange("table")}
          aria-pressed={viewMode === "table"}
          data-testid="button-view-table"
          className={buttonClassName}
        >
          <Table className="h-4 w-4" aria-hidden="true" />
          <span className={labelClassName}>{tableLabel}</span>
        </Button>
        <Button
          variant={viewMode === "cards" ? activeVariant : "ghost"}
          size="sm"
          onClick={() => onChange("cards")}
          aria-pressed={viewMode === "cards"}
          data-testid="button-view-cards"
          className={buttonClassName}
        >
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          <span className={labelClassName}>{cardsLabel}</span>
        </Button>
      </div>
    </>
  );
}
