import { Copy, Mail, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { splitContactList } from "@shared/schema";

interface ContactPanelProps {
  primaryContact?: string;
  contactEmail?: string;
  projectName?: string;
}

export function ContactPanel({ primaryContact, contactEmail, projectName }: ContactPanelProps) {
  const { toast } = useToast();
  const names = splitContactList(primaryContact);
  const emails = splitContactList(contactEmail);

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast({ title: "Email copied", description: email });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-5" data-testid="contact-panel">
      {projectName && (
        <p className="text-sm text-muted-foreground" data-testid="text-contact-project">
          {projectName}
        </p>
      )}

      <div data-testid="section-primary-contacts">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <UserCircle className="h-4 w-4 text-muted-foreground" />
          Primary Contact{names.length === 1 ? "" : "s"}
        </div>
        {names.length === 0 ? (
          <p className="pl-6 text-sm text-muted-foreground" data-testid="text-no-primary-contacts">
            None provided
          </p>
        ) : (
          <ul className="space-y-1.5 pl-6">
            {names.map((name, i) => (
              <li
                key={`name-${i}`}
                className="text-sm"
                data-testid={`text-contact-name-${i}`}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div data-testid="section-contact-emails">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Contact Email{emails.length === 1 ? "" : "s"}
        </div>
        {emails.length === 0 ? (
          <p className="pl-6 text-sm text-muted-foreground" data-testid="text-no-contact-emails">
            None provided
          </p>
        ) : (
          <ul className="space-y-1.5 pl-6">
            {emails.map((email, i) => {
              const isEmail = /\S+@\S+\.\S+/.test(email);
              return (
                <li
                  key={`email-${i}`}
                  className="flex items-center gap-2 text-sm"
                  data-testid={`text-contact-email-${i}`}
                >
                  {isEmail ? (
                    <a
                      href={`mailto:${email}`}
                      className="break-all text-primary hover:underline"
                      data-testid={`link-email-${i}`}
                    >
                      {email}
                    </a>
                  ) : (
                    <span className="break-all">{email}</span>
                  )}
                  {isEmail && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => copyEmail(email)}
                      aria-label={`Copy ${email}`}
                      data-testid={`button-copy-email-${i}`}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
