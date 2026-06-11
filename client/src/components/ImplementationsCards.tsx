import { useState } from "react";
import type { IpsImplementation } from "@shared/schema";
import {
  distinctContactCount,
  continentForJurisdiction,
  CONTINENT_ORDER,
} from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, FileText, MapPin, Building2, ExternalLink, Users, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContactPanel } from "./ContactPanel";

interface Props {
  results: IpsImplementation[];
  groupByContinent?: boolean;
}

function LinkRow({
  icon: Icon,
  label,
  url,
  testId,
}: {
  icon: typeof Globe;
  label: string;
  url?: string;
  testId: string;
}) {
  if (!url) return null;
  const trimmed = url.trim();
  const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-w-0 items-center gap-1 text-primary hover:underline"
        data-testid={testId}
      >
        <span className="truncate">{trimmed}</span>
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    </div>
  );
}

interface FlipCardProps {
  impl: IpsImplementation;
  index: number;
  onOpenModal: (impl: IpsImplementation) => void;
}

function FlipCard({ impl, index, onOpenModal }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const isMobile = useIsMobile();
  const contactCount = distinctContactCount(impl.primaryContact, impl.contactEmail);
  const hasContacts = contactCount > 0;

  const onContactsClick = () => {
    if (!hasContacts) return;
    if (isMobile) {
      onOpenModal(impl);
    } else {
      setFlipped(true);
    }
  };

  return (
    <div
      className="flip-card card-enter"
      style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
      data-testid={`flip-card-${index}`}
    >
      <div className={`flip-card-inner ${flipped ? "is-flipped" : ""}`}>
        {/* FRONT */}
        <Card
          className="flip-card-face flex h-full flex-col"
          data-testid={`card-impl-${index}`}
          aria-hidden={flipped}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-start gap-2 text-base">
              <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="line-clamp-2" data-testid={`text-jurisdiction-${index}`}>
                {impl.jurisdiction}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2.5">
            {impl.projectName && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Project:</span>
                <span className="font-medium" data-testid={`text-project-${index}`}>
                  {impl.projectName}
                </span>
              </div>
            )}
            {impl.approach && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Approach:</span>
                <span className="font-medium" data-testid={`text-approach-${index}`}>
                  {impl.approach}
                </span>
              </div>
            )}
            <LinkRow
              icon={Globe}
              label="IPS Info"
              url={impl.infoWebsite}
              testId={`link-info-${index}`}
            />
            <LinkRow
              icon={FileText}
              label="Data Domains"
              url={impl.dataDomainsLink}
              testId={`link-domains-${index}`}
            />
            <div className="mt-auto pt-3">
              <Button
                variant="outline"
                className="w-full gap-2 min-h-11 sm:min-h-9"
                onClick={onContactsClick}
                disabled={!hasContacts}
                data-testid={`button-view-contacts-${index}`}
              >
                <Users className="h-4 w-4" />
                {hasContacts
                  ? `View Contact${contactCount === 1 ? "" : "s"} (${contactCount})`
                  : "No Contacts"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* BACK (desktop only — mobile uses modal) */}
        <Card
          className="flip-card-face flip-card-back"
          data-testid={`card-impl-back-${index}`}
          aria-hidden={!flipped}
        >
          <div className="flip-card-back-scroll flex h-full flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base" data-testid={`text-back-title-${index}`}>
                  {impl.jurisdiction} — Contacts
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setFlipped(false)}
                  aria-label="Back to card front"
                  data-testid={`button-flip-back-${index}`}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <ContactPanel
                primaryContact={impl.primaryContact}
                contactEmail={impl.contactEmail}
                projectName={impl.projectName}
                compact
              />
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ImplementationsCards({ results, groupByContinent = false }: Props) {
  const [modalImpl, setModalImpl] = useState<IpsImplementation | null>(null);

  if (results.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border">
        <div className="text-center">
          <p className="text-muted-foreground">No implementations found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  const renderGrid = (items: IpsImplementation[], keyPrefix = "") => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((impl, index) => (
        <FlipCard
          key={`${keyPrefix}${impl.jurisdiction}-${index}`}
          impl={impl}
          index={index}
          onOpenModal={setModalImpl}
        />
      ))}
    </div>
  );

  let content;
  if (groupByContinent) {
    const grouped = results.reduce((acc, r) => {
      const c = continentForJurisdiction(r.jurisdiction);
      if (!acc[c]) acc[c] = [];
      acc[c].push(r);
      return acc;
    }, {} as Record<string, IpsImplementation[]>);
    const sortedKeys = CONTINENT_ORDER.filter((c) => grouped[c]?.length);
    content = (
      <div className="space-y-8">
        {sortedKeys.map((c) => (
          <div key={c} className="space-y-4">
            <div className="flex items-center gap-3 border-b pb-2">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold" data-testid={`text-continent-header-${c}`}>
                {c}
              </h3>
              <span className="text-sm text-muted-foreground">
                ({grouped[c].length} {grouped[c].length === 1 ? "entry" : "entries"})
              </span>
            </div>
            {renderGrid(grouped[c], `${c}-`)}
          </div>
        ))}
      </div>
    );
  } else {
    content = renderGrid(results);
  }

  return (
    <>
      {content}
      <Dialog open={!!modalImpl} onOpenChange={(o) => !o && setModalImpl(null)}>
        <DialogContent data-testid="dialog-impl-contacts">
          <DialogHeader>
            <DialogTitle>{modalImpl?.jurisdiction} — Contacts</DialogTitle>
          </DialogHeader>
          {modalImpl && (
            <ContactPanel
              primaryContact={modalImpl.primaryContact}
              contactEmail={modalImpl.contactEmail}
              projectName={modalImpl.projectName}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
