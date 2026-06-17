import { ExternalLink } from "lucide-react";
import interopLogo from "@assets/Interop-PNG-ImageTransparent_1781710478896.webp";

export function Footer() {
  return (
    <footer className="border-t bg-card py-6 md:py-8">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            <div>
              <h4 className="mb-3 font-semibold">About IPS</h4>
              <p className="text-sm text-muted-foreground">
                The International Patient Summary is a minimal and non-exhaustive set of basic clinical data of a patient.
              </p>
            </div>
            
            <div>
              <h4 className="mb-3 font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://international-patient-summary.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    IPS Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://international-patient-summary.net/patient/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    For Patients
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://international-patient-summary.net/healthcare-professional/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    For Healthcare Professionals
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-3 font-semibold">Contact</h4>
              <p className="text-sm text-muted-foreground">
                For questions about this registry or IPS implementation, visit the official IPS website.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col items-center gap-3 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} IPS Registries. All rights reserved.</p>
            <a
              href="https://www.interop.it/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md text-xs hover-elevate"
              data-testid="link-powered-by-interop"
            >
              <span>Powered by</span>
              <img
                src={interopLogo}
                alt="Interop IT"
                className="h-5 w-auto"
                data-testid="img-interop-logo"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
