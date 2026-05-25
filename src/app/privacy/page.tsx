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
import { Shield, Lock, Code, Heart, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAbsoluteUrl } from "@/lib/metadata";

const siteUrl = getAbsoluteUrl("/privacy");

export const metadata: Metadata = {
  title: "Privacy Policy | Ian Lintner / Lintner Consulting LLC",
  description:
    "Official Privacy Policy detailing our standard non-collection practices, open-source model, and donationware support policy.",
  openGraph: {
    title: "Privacy Policy | Ian Lintner / Lintner Consulting LLC",
    description:
      "Official Privacy Policy detailing our standard non-collection practices, open-source model, and donationware support policy.",
    type: "website",
    url: siteUrl,
  },
};

export default function PrivacyPage() {
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
                Privacy Policy
              </span>
            }
            description="Effective Date: May 25, 2026. Standard non-collection policy for applications and websites built by Ian Lintner / Lintner Consulting LLC."
          />
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container className="max-w-4xl">
          <div className="space-y-6">
            {/* Core Philosophy */}
            <Card className="glass-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Shield className="h-5 w-5" />
                  Privacy by Default
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  We believe that software should respect its users. All
                  applications and websites published by
                  <strong> Ian Lintner</strong> and{" "}
                  <strong>Lintner Consulting LLC</strong> are designed from the
                  ground up with a strict privacy-first model.
                </p>
                <p>
                  We do not monetarily track our users, serve third-party ads,
                  or collect diagnostic details beyond standard, opt-in platform
                  statistics.
                </p>
              </CardContent>
            </Card>

            {/* Non-Collection Details */}
            <Card className="glass-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Lock className="h-5 w-5" />
                  Data We Do Not Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Our software operates on a{" "}
                  <strong>non-collection model</strong>. We do not gather,
                  store, log, share, or sell:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2 leading-relaxed">
                  <li>
                    <strong className="text-foreground">
                      Personal Information:
                    </strong>{" "}
                    Names, email addresses, phone numbers, or account usernames
                    (unless you choose to contact support directly).
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Activity & Usage Data:
                    </strong>{" "}
                    Interactivity logs, settings preferences, or click paths
                    inside our software.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Device Identifiers:
                    </strong>{" "}
                    IP addresses, MAC addresses, device locations, or unique
                    advertising IDs.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Open Source details */}
            <Card className="glass-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Code className="h-5 w-5" />
                  Open Source & Auditable
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  All of our applications are open-source. Because the full
                  source code is publicly accessible (hosted on GitHub), our
                  claims of non-collection are entirely transparent and
                  verifiable by the developer community.
                </p>
                <p>
                  We do not insert hidden tracking libraries, analytical SDKs,
                  or data brokers into our builds.
                </p>
              </CardContent>
            </Card>

            {/* Donationware payments */}
            <Card className="glass-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Heart className="h-5 w-5" />
                  Free & Donationware Model
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Our software is distributed free of charge. Supporting our
                  development is completely optional and handled via voluntary
                  contributions (donationware).
                </p>
                <p>
                  All payments and sponsorships are processed securely through
                  trusted third-party platforms (e.g., itch.io, GitHub Sponsors,
                  or PayPal). We do not collect, process, or store credit card
                  numbers, billing addresses, or other payment transaction
                  details.
                </p>
              </CardContent>
            </Card>

            {/* Telemetry info */}
            <Card className="glass-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <HelpCircle className="h-5 w-5" />
                  Platform Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  For mobile applications published on the Apple App Store,
                  Google Play, or other platforms, anonymized crash logs and
                  system statistics may be collected by the platform provider.
                </p>
                <p>
                  This data is only shared with us if you have explicitly opted
                  into sharing diagnostic data in your system settings. This
                  information is completely anonymous and used solely to repair
                  software bugs.
                </p>
              </CardContent>
            </Card>

            {/* Footer note */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card border border-border p-6 rounded-xl">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground text-sm">
                  Have privacy questions?
                </h4>
                <p className="text-xs text-muted-foreground">
                  Get in touch with us regarding our data policies.
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
