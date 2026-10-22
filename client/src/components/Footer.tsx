/**
 * Site footer with Interop-IT branding and related external links, shared across
 * all pages.
 */
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
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    IPS Website
                  </a>
                </li>
                <li>
                  <a
                    href="https://international-patient-summary.net/patient/"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    For Patients
                  </a>
                </li>
                <li>
                  <a
                    href="https://international-patient-summary.net/healthcare-professional/"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    For Healthcare Professionals
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-3 font-semibold">Contact</h4>
              <p className="text-sm text-muted-foreground">
                <a
                  href="https://international-patient-summary.net/contact/"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  IPS Contact Information (for registry or website inquiries)
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col items-center gap-3 border-t pt-6 text-center text-sm text-muted-foreground">
            <a
              href="https://www.interop.it/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md px-1 text-xs hover-elevate"
              data-testid="link-powered-by-interop"
            >
              <span>Powered by Interop.it | © {new Date().getFullYear()} Interop IT inc. All Rights Reserved.</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
