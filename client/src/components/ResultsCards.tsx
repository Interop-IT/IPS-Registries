import type { VendorResult } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, User, Calendar, MapPin, Package, Globe, UserCircle, Mail } from "lucide-react";

interface ResultsCardsProps {
  results: VendorResult[];
}

export function ResultsCards({ results }: ResultsCardsProps) {
  if (results.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border">
        <div className="text-center">
          <p className="text-muted-foreground">No results found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.map((result, index) => (
        <Card
          key={`${result.company}-${result.actor}-${result.year}-${index}`}
          className="hover-elevate"
          data-testid={`card-result-${index}`}
        >
          <CardHeader>
            <CardTitle className="flex items-start gap-2 text-base">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              {result.website ? (
                <a
                  href={result.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="line-clamp-2 text-primary hover:underline"
                  data-testid={`link-company-${index}`}
                >
                  {result.company}
                </a>
              ) : (
                <span className="line-clamp-2" data-testid={`text-company-${index}`}>
                  {result.company}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Profile:</span>
              <span className="font-medium" data-testid={`text-profile-${index}`}>
                {result.profile}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Actor:</span>
              <span className="font-medium" data-testid={`text-actor-${index}`}>
                {result.actor}
              </span>
            </div>
            {result.product && (
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Product:</span>
                <span className="font-medium" data-testid={`text-product-${index}`}>
                  {result.product}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Year:</span>
              <span className="font-medium" data-testid={`text-year-${index}`}>
                {result.year}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Event:</span>
              <span className="font-medium" data-testid={`text-event-${index}`}>
                {result.event}
              </span>
            </div>
            {result.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Website:</span>
                <a
                  href={result.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                  data-testid={`link-website-${index}`}
                >
                  Link
                </a>
              </div>
            )}
            {result.primaryContact && (
              <div className="flex items-center gap-2 text-sm">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-medium truncate" data-testid={`text-primaryContact-${index}`}>
                  {result.primaryContact}
                </span>
              </div>
            )}
            {result.contactInfo && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Info:</span>
                <span className="font-medium truncate" data-testid={`text-contactInfo-${index}`}>
                  {result.contactInfo}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
