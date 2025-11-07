import { Database, Users, Calendar } from "lucide-react";

interface HeroSectionProps {
  totalVendors: number;
  totalResults: number;
  latestEvent: string;
}

export function HeroSection({ totalVendors, totalResults, latestEvent }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
            International Patient Summary Testing Results
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:mt-4 md:text-lg">
            Search and explore vendors that have tested IPS at various healthcare interoperability events worldwide
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 md:mt-8 md:gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                <span className="text-2xl font-bold" data-testid="text-vendor-count">{totalVendors}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Vendors</p>
            </div>
            
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Database className="h-5 w-5" />
                <span className="text-2xl font-bold" data-testid="text-result-count">{totalResults}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Test Results</p>
            </div>
            
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Calendar className="h-5 w-5" />
                <span className="text-base font-bold sm:text-2xl" data-testid="text-latest-event">{latestEvent}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Latest Event</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
