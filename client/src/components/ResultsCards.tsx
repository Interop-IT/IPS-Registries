import type { VendorResult } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, User, Calendar, MapPin, Package, Globe, UserCircle, Mail } from "lucide-react";

interface ResultsCardsProps {
  results: VendorResult[];
  groupByCompany?: boolean;
}

export function ResultsCards({ results, groupByCompany = false }: ResultsCardsProps) {
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

  // Group results by company if requested
  if (groupByCompany) {
    const groupedResults = results.reduce((groups, result) => {
      const company = result.company;
      if (!groups[company]) {
        groups[company] = [];
      }
      groups[company].push(result);
      return groups;
    }, {} as Record<string, VendorResult[]>);

    const sortedCompanies = Object.keys(groupedResults).sort();

    return (
      <div className="space-y-8">
        {sortedCompanies.map((company) => {
          const companyResults = groupedResults[company];
          const website = companyResults[0].website;
          
          return (
            <div key={company} className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-2">
                <Building2 className="h-5 w-5 text-primary" />
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-primary hover:underline"
                    data-testid={`link-company-header-${company}`}
                  >
                    {company}
                  </a>
                ) : (
                  <h3 className="text-lg font-semibold" data-testid={`text-company-header-${company}`}>
                    {company}
                  </h3>
                )}
                <span className="text-sm text-muted-foreground">
                  ({companyResults.length} {companyResults.length === 1 ? 'result' : 'results'})
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {companyResults.map((result, index) => (
                  <Card
                    key={`${result.company}-${result.actor}-${result.year}-${index}`}
                    className="hover-elevate"
                    data-testid={`card-result-${company}-${index}`}
                  >
                    <CardContent className="space-y-2 pt-6">
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
                            {result.website.substring(0, 25)}
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
            </div>
          );
        })}
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
                  {result.website.substring(0, 25)}
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
