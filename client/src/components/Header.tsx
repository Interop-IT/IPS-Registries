import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import ipsLogo from "@assets/image_1762374965666.png";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavLink = {
  href: string;
  label: string;
  testId: string;
  external?: boolean;
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const navLinks: NavLink[] = [
    { href: "/", label: "Testing Results", testId: "link-results" },
    { href: "/implementations", label: "Implementation Registry", testId: "link-implementations" },
    {
      href: "https://international-patient-summary.net/",
      label: "About IPS",
      testId: "link-about",
      external: true,
    },
  ];

  const linkColor = { color: "hsl(348, 83%, 47%)" } as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:h-20 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <img 
            src={ipsLogo} 
            alt="IPS Logo" 
            className="h-10 w-auto md:h-16"
            data-testid="img-logo"
          />
          <div className="flex flex-col">
            <h1 className="text-sm font-bold leading-none md:text-xl" style={{ color: 'hsl(348, 83%, 47%)' }}>
              IPS Results Registry
            </h1>
            <p className="mt-0.5 hidden text-sm text-muted-foreground sm:block md:mt-1">
              International Patient Summary Testing Results
            </p>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive = !link.external && location === link.href;
            const className = `rounded-md px-3 py-2 text-sm font-semibold transition-colors hover-elevate ${
              isActive ? "underline underline-offset-4" : ""
            }`;
            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  style={linkColor}
                  data-testid={link.testId}
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={className}
                style={linkColor}
                data-testid={link.testId}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle style={{ color: 'hsl(348, 83%, 47%)' }}>
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const className =
                    "text-base font-semibold transition-colors hover-elevate active-elevate-2 rounded-md p-3 min-h-[44px] flex items-center";
                  if (link.external) {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                        style={linkColor}
                        data-testid={`mobile-${link.testId}`}
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={className}
                      style={linkColor}
                      data-testid={`mobile-${link.testId}`}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
