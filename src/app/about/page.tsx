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
  Mail,
  Shield,
  Info,
  HelpCircle,
  Building,
  ExternalLink,
} from "lucide-react";
import { getAbsoluteUrl } from "@/lib/metadata";

const siteUrl = getAbsoluteUrl("/about");

export const metadata: Metadata = {
  title: "About & Support | Ian Lintner / Lintner Consulting LLC",
  description:
    "Developer information, application support, and privacy policies for projects built by Ian Lintner and Lintner Consulting LLC.",
  openGraph: {
    title: "About & Support | Ian Lintner / Lintner Consulting LLC",
    description:
      "Developer information, application support, and privacy policies for projects built by Ian Lintner and Lintner Consulting LLC.",
    type: "website",
    url: siteUrl,
  },
};

export default function AboutPage() {
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
                About & Support
              </span>
            }
            description="Official developer profile, application support, and legal information for projects built by Ian Lintner and Lintner Consulting LLC."
          />
        </Container>
      </Section>

      {/* Main Content Section */}
      <Section spacing="lg">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Organization & Support */}
            <div className="space-y-6">
              {/* Organization Profile */}
              <Card className="glass-elevated hover:border-primary/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Building className="h-5 w-5" />
                    Developer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    This website and its associated projects are developed and
                    maintained by{" "}
                    <strong className="text-foreground font-semibold">
                      Ian Lintner
                    </strong>{" "}
                    under{" "}
                    <strong className="text-foreground font-semibold">
                      Lintner Consulting LLC
                    </strong>
                    , a software consultancy specializing in secure cloud
                    platform architecture, scalable systems engineering, and
                    AI-augmented developer workflows.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    With over 20 years of engineering leadership, our mission is
                    to deliver high-quality, high-reliability software
                    components and production-ready architectures.
                  </p>
                </CardContent>
              </Card>

              {/* App Support */}
              <Card className="glass-glow hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <HelpCircle className="h-5 w-5" />
                    Application Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Need help, have questions, or want to submit feedback for
                    any of our applications? We are dedicated to providing
                    support and hearing your suggestions.
                  </p>
                  <div className="rounded-lg bg-accent/20 p-4 border border-accent/30 space-y-3">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Email Support
                        </p>
                        <a
                          href="mailto:dev@codelintner.com"
                          className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1 mt-0.5"
                        >
                          dev@codelintner.com
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Support response timeframe: We typically respond to support
                    queries within 2 to 3 business days.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Privacy & Legal */}
            <div className="space-y-6">
              {/* Privacy Policy */}
              <Card className="glass-elevated hover:border-primary/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Shield className="h-5 w-5" />
                    Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We take your privacy seriously. This privacy policy applies
                    to all applications published under the developer account of
                    Ian Lintner / Lintner Consulting LLC.
                  </p>
                  <Divider className="my-2" />
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Data Collection
                      </h4>
                      <p className="leading-relaxed">
                        Our applications are designed with privacy by default.
                        We do not collect, store, transmit, or sell any
                        personally identifiable information (PII) or sensitive
                        user data.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        App Store Analytics & Diagnostics
                      </h4>
                      <p className="leading-relaxed">
                        Anonymized performance logs, crash telemetry, and
                        general usage statistics may be collected automatically
                        by Apple Inc. on our behalf if you have opted into
                        sharing diagnostic information with app developers. This
                        data contains no personal identifiers and is utilized
                        solely to fix bugs and improve application performance.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Third-Party Services
                      </h4>
                      <p className="leading-relaxed">
                        Our applications do not integrate third-party ad
                        networks, tracking scripts, or data brokers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal & Terms */}
              <Card className="glass-elevated hover:border-primary/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Info className="h-5 w-5" />
                    Terms of Use
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Applications developed and published by Ian Lintner /
                    Lintner Consulting LLC are provided &ldquo;as is&rdquo;,
                    without warranty of any kind, express or implied, including
                    but not limited to the warranties of merchantability,
                    fitness for a particular purpose, and non-infringement.
                  </p>
                  <p>
                    In no event shall the authors or copyright holders be liable
                    for any claim, damages, or other liability, whether in an
                    action of contract, tort, or otherwise, arising from, out
                    of, or in connection with the software or the use or other
                    dealings in the software.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
