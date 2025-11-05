# IPS Results Registry - Design Guidelines

## Design Approach
**System-Based Approach**: Material Design principles for data-intensive applications, adapted for healthcare professionalism. Drawing inspiration from Google's clean data tables and the polished aesthetic of international-patient-summary.net.

## Design Principles
1. **Healthcare Professionalism**: Clean, trustworthy interface befitting medical standards
2. **Search-First Experience**: Prominent filtering as the primary user interaction
3. **Data Clarity**: Information hierarchy optimized for scanning vendor results
4. **Responsive Precision**: Seamless experience from mobile to desktop

## Typography System
- **Primary Font**: Inter or similar sans-serif via Google Fonts (professional, highly legible)
- **Display/Headers**: 2xl to 4xl, font-weight 700-800
- **Body Text**: Base to lg, font-weight 400-500
- **Table Data**: sm to base, font-weight 400-600 for emphasis
- **Labels/Meta**: xs to sm, font-weight 500-600

## Layout & Spacing
**Spacing Scale**: Use Tailwind units of 2, 3, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-24
- Grid gaps: gap-4 to gap-8
- Card padding: p-6
- Container max-width: max-w-7xl

## Core Components

### Header Navigation
- Fixed top bar with logo (left), navigation links (center), CTA button (right)
- Height: h-16 to h-20
- Shadow: shadow-sm for depth
- Padding: px-6 py-4

### Hero Section
- **No large hero image** - This is a utility application
- Compact header section (h-48 to h-64) with:
  - Page title (text-4xl font-bold)
  - Subtitle explaining registry purpose (text-lg)
  - Quick stats (vendor count, latest event)
- Background: Subtle gradient or pattern, not image-heavy

### Search & Filter Interface
**Primary Feature** - Multi-select filter system:
- Horizontal filter bar on desktop, stacked on mobile
- 5 filter dropdowns: Company, IHE Profile, Actor, Year, Event
- Each dropdown:
  - Min-width: w-48
  - Multi-select with checkboxes
  - Search within dropdown
  - "Clear" and "Apply" actions
- "Reset All Filters" button (secondary style)
- Active filter pills below dropdowns showing selected items (dismissible with X)

### Results Display
**Data Table** (primary view):
- Striped rows for readability (alternating background)
- Column headers: Company | IHE Profile | Actor | Year | Event
- Sortable columns (click header to sort)
- Hover state on rows
- Responsive: Cards on mobile (<768px), table on desktop
- Pagination controls at bottom (if >50 results)
- Results count display: "Showing X of Y results"

**Card View** (mobile alternative):
- Each vendor result as a card
- Company name as card header (text-lg font-semibold)
- Grid layout of metadata (2 columns)
- Divider between cards

### Footer
- Compact footer with:
  - Links to IPS website, documentation
  - Contact information
  - Copyright notice
- Height: auto, py-8
- 3-column layout on desktop, stacked on mobile

## Component Library

### Buttons
- **Primary**: Solid, rounded-md, px-6 py-3, font-medium
- **Secondary**: Outlined, same sizing
- **Icon Buttons**: Square, p-2, for close/clear actions

### Form Elements
- **Dropdowns**: Custom styled, rounded-lg, border, p-3
- **Checkboxes**: Custom, larger than default (w-5 h-5)
- **Search Inputs**: Rounded-lg, with search icon prefix

### Cards
- Border or shadow (shadow-md), rounded-lg
- Padding: p-6
- Hover: slight shadow increase (shadow-lg)

### Badges/Pills
- Filter pills: rounded-full, px-3 py-1, text-sm
- Status indicators: Small badges for active/inactive

## Responsive Breakpoints
- Mobile: < 768px (single column, card view)
- Tablet: 768px - 1024px (2-column filters, table view)
- Desktop: > 1024px (full layout, 5-column filters)

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation for filters and table
- Focus indicators (ring-2 ring-offset-2)
- Sufficient contrast ratios throughout
- Screen reader friendly table markup

## Images
**No hero image required** - This is a data-focused utility application. Only use:
- IPS logo in header
- Decorative icons within filter dropdowns and table headers (sort arrows)
- Empty state illustration if no results found (simple, professional SVG)

## Animations
Minimal, purposeful animations only:
- Dropdown open/close: 200ms ease
- Filter pill removal: fade out 150ms
- Row hover: background transition 100ms
- No scroll animations or complex transitions