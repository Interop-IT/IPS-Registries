import { Database, Users, Calendar } from "lucide-react";

interface HeroSectionProps {
  totalVendors: number;
  totalResults: number;
  latestEvent: string;
}

export function HeroSection({ totalVendors, totalResults, latestEvent }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-background py-12">
      <div className="container px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            International Patient Summary Testing Results
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Search and explore vendors that have tested IPS at various healthcare interoperability events worldwide
          </p>
          
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <span className="text-2xl font-bold" data-testid="text-latest-event">{latestEvent}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Latest Event</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
