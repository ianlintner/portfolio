import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Divider,
  PageHeader,
  Section,
} from "@ianlintner/theme";
import {
  FileText,
  Code,
  Heart,
  AlertTriangle,
  ShieldCheck,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { getAbsoluteUrl } from "@/lib/metadata";

const siteUrl = getAbsoluteUrl("/terms");

export const metadata: Metadata = {
  title: "Terms of Service | Ian Lintner / Lintner Consulting LLC",
  description:
    "Official Terms of Service detailing our open-source licenses, donationware terms, and standard disclaimers of liability.",
  openGraph: {
    title: "Terms of Service | Ian Lintner / Lintner Consulting LLC",
    description:
      "Official Terms of Service detailing our open-source licenses, donationware terms, and standard disclaimers of liability.",
    type: "website",
    url: siteUrl,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <Section
        spacing="lg"
        className="border-b bg-gradient-to-br from-background via-primary/5 to-background"
      >
        <Container>
          <PageHeader
            title={
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Terms of Service
              </span>
            }
            description="Effective Date: May 25, 2026. Governing terms for downloaded and distributed software applications (iOS, Android, itch.io, Steam, etc.) published by Ian Lintner / Lintner Consulting LLC."
          />
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container className="max-w-4xl">
          <div className="space-y-6">
            {/* Agreement to Terms */}
            <Card className="glass-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <FileText className="h-5 w-5" />
                  1. Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                By downloading, installing, running, or accessing downloaded and
                distributed software applications (including iOS, Android,
                itch.io, Steam, and desktop builds) published by{" "}
                <strong className="text-foreground">Ian Lintner</strong> and{" "}
                <strong className="text-foreground">
                  Lintner Consulting LLC
                </strong>
                , you acknowledge that you have read, understood, and agree to
                be bound by these Terms of Service. If you do not agree, please
                do not use or download our software.
              </CardContent>
            </Card>

            {/* Open Source Licensing */}
            <Card className="glass-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Code className="h-5 w-5" />
                  2. Open Source Licensing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Most of our applications are open-source and governed by the{" "}
                  <strong>MIT License</strong> or other permissive licenses. You
                  are welcome and encouraged to clone, review, modify, and
                  redistribute the source code under the conditions specified in
                  each respective project&apos;s repository.
                </p>
                <p>
                  Please refer to the `LICENSE` file in the root of each GitHub
                  repository for the specific licensing terms and conditions
                  applicable to that codebase.
                </p>
              </CardContent>
            </Card>

            {/* Donationware Terms */}
            <Card className="glass-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Heart className="h-5 w-5" />
                  3. Pricing & Donationware
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Our software is free to download and use. Any payments,
                  contributions, or financial sponsorships are
                  <strong> strictly voluntary</strong> (donationware) to support
                  the ongoing maintenance and development of open-source
                  projects.
                </p>
                <p>
                  Sponsorships and donations are non-refundable and do not
                  constitute a purchase of proprietary rights, custom service
                  agreements, or dedicated support contracts.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer of Warranties */}
            <Card className="glass-elevated border-destructive/20 hover:border-destructive/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  4. Disclaimer of Warranties
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed space-y-3">
                <p className="font-semibold uppercase tracking-wider text-foreground text-xs">
                  Provided &ldquo;As Is&rdquo;
                </p>
                <p>
                  THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo;, WITHOUT WARRANTY
                  OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
                  THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                  PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p>
                  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
                  FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN
                  ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF,
                  OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
                  DEALINGS IN THE SOFTWARE.
                </p>
              </CardContent>
            </Card>

            {/* Terms updates */}
            <Card className="glass-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  5. Changes to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or replace these terms at any
                time. Any changes will be posted directly on this page with an
                updated effective date. Continued use of our software after
                updates indicates your acceptance of the modified Terms of
                Service.
              </CardContent>
            </Card>

            {/* Footer note */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card border border-border p-6 rounded-xl">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground text-sm">
                  Have legal or licensing questions?
                </h4>
                <p className="text-xs text-muted-foreground">
                  Get in touch with us regarding our licensing or terms.
                </p>
              </div>
              <a
                href="mailto:dev@codelintner.com"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/90 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
