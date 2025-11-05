import { ThemeToggle } from "./ThemeToggle";
import ipsLogo from "@assets/image_1762374965666.png";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <img 
            src={ipsLogo} 
            alt="IPS Logo" 
            className="h-16 w-auto"
            data-testid="img-logo"
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-none" style={{ color: 'hsl(348, 83%, 47%)' }}>
              IPS Results Registry
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">International Patient Summary Testing Results</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-6">
          <a 
            href="#home" 
            className="text-sm font-semibold transition-colors hover-elevate"
            style={{ color: 'hsl(348, 83%, 47%)' }}
            data-testid="link-home"
          >
            Home
          </a>
          <a 
            href="#search" 
            className="text-sm font-semibold transition-colors hover-elevate"
            style={{ color: 'hsl(348, 83%, 47%)' }}
            data-testid="link-search"
          >
            Search
          </a>
          <a 
            href="https://international-patient-summary.net/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold transition-colors hover-elevate"
            style={{ color: 'hsl(348, 83%, 47%)' }}
            data-testid="link-about"
          >
            About IPS
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
