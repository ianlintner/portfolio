import type { Metadata } from "next";
import Link from "next/link";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Divider,
  PageHeader,
  Section,
} from "@ianlintner/theme";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { getAbsoluteUrl, getDefaultSocialImage } from "@/lib/metadata";
import { ResumeActions } from "./ResumeActions";

const siteUrl = getAbsoluteUrl("/resume");
const imageUrl = getDefaultSocialImage();

export const metadata: Metadata = {
  title: "Resume | Ian Lintner — Lead Engineer (Distributed Systems, AI Platforms)",
  description:
    "Software engineering resume for Ian Lintner — Lead Engineer focused on distributed systems, cloud platforms, and LLM-enabled products.",
  keywords: [
    "Ian Lintner",
    "software engineer",
    "lead engineer",
    "team lead",
    "platform engineer",
    "distributed systems",
    "event-driven architecture",
    "microservices",
    "Scala",
    "ZIO",
    "Akka",
    "Kafka",
    "OpenTelemetry",
    "Datadog",
    "Kubernetes",
    "Terraform",
    "GCP",
    "AWS",
    "LLM",
    "AI platform",
    "observability",
    "security",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Resume | Ian Lintner",
    description:
      "Lead Engineer with 20+ years building secure, event-driven, cloud-native systems and LLM-enabled platforms.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "Resume — Ian Lintner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume | Ian Lintner",
    description:
      "Lead Engineer focused on distributed systems, AI platforms, and observability.",
    images: [imageUrl],
  },
};

const LINKS = {
  email: "mailto:lintner.ian@gmail.com",
  phone: "tel:+15153604655",
  github: "https://github.com/ianlintner",
  linkedin: "https://linkedin.com/in/ianlintner/",
  portfolio: "https://portfolio.hugecat.net",
} as const;

const COMPANIES = {
  carvana: { name: "Carvana", url: "https://www.carvana.com" },
  smartthings: { name: "Samsung SmartThings", url: "https://www.smartthings.com" },
  workiva: { name: "Workiva", url: "https://www.workiva.com" },
  twoRivers: {
    name: "Two Rivers Marketing",
    url: "https://www.tworiversmarketing.com",
  },
  drake: { name: "Drake University", url: "https://www.drake.edu" },
} as const;

function ExternalA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary underline underline-offset-4 hover:opacity-90"
    >
      {children} <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

export default function ResumePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ian Lintner",
    jobTitle: "Lead Engineer / Team Lead",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Minneapolis",
      addressRegion: "MN",
      addressCountry: "US",
    },
    email: "lintner.ian@gmail.com",
    telephone: "+1-515-360-4655",
    url: LINKS.portfolio,
    sameAs: [LINKS.github, LINKS.linkedin],
    knowsAbout: [
      "Distributed Systems",
      "Event-driven Architecture",
      "Microservices",
      "Scala",
      "ZIO",
      "Akka",
      "Kafka",
      "OpenTelemetry",
      "Kubernetes",
      "Terraform",
      "Cloud Platforms (AWS, GCP)",
      "LLM systems",
      "Observability",
      "Security",
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section
        spacing="lg"
        className="border-b bg-gradient-to-br from-background via-primary/5 to-background"
      >
        <PageHeader
          title={
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Ian Lintner
            </span>
          }
          description={
            <span>
              Lead Engineer · Full Stack · Distributed Systems · AI Platforms · Functional Programming
            </span>
          }
          actions={<ResumeActions />}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-muted-foreground">
              Senior software engineer and team lead with <strong>20+ years</strong> designing and delivering
              secure, event-driven, cloud-native platforms. Deep expertise in
              <strong> Scala (ZIO/Akka)</strong>, <strong>LLM-enabled systems</strong>, and
              <strong> observability at scale</strong>. Known for driving technical strategy,
              mentoring peers, and executing large migrations while remaining hands-on.
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge pill variant="info">Distributed Systems</Badge>
              <Badge pill variant="info">Event-Driven</Badge>
              <Badge pill variant="info">AI / LLM Products</Badge>
              <Badge pill variant="info">Platform + Security</Badge>
              <Badge pill variant="secondary">Scala</Badge>
              <Badge pill variant="secondary">Kubernetes</Badge>
              <Badge pill variant="secondary">OpenTelemetry</Badge>
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Minneapolis, MN
              </span>
              <a className="inline-flex items-center gap-2 hover:text-foreground" href={LINKS.email}>
                <Mail className="h-4 w-4" /> lintner.ian@gmail.com
              </a>
              <a className="inline-flex items-center gap-2 hover:text-foreground" href={LINKS.phone}>
                <Phone className="h-4 w-4" /> 515-360-4655
              </a>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <ExternalA href={LINKS.linkedin}>
                <span className="inline-flex items-center gap-2">
                  <SiLinkedin className="h-4 w-4" /> LinkedIn
                </span>
              </ExternalA>
              <ExternalA href={LINKS.github}>
                <span className="inline-flex items-center gap-2">
                  <SiGithub className="h-4 w-4" /> GitHub
                </span>
              </ExternalA>
              <ExternalA href={LINKS.portfolio}>Portfolio</ExternalA>
            </div>

            <details className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold">
                Phone screen version (60 seconds)
              </summary>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Lead Engineer with 20+ years building cloud-native, event-driven systems and secure APIs.
                  </li>
                  <li>
                    Recent focus: AI communications platform (LLM chat/routing, orchestration, summarization).
                  </li>
                  <li>
                    Strong in Scala (ZIO/Akka), Kafka, Kubernetes, Terraform, and OpenTelemetry end-to-end tracing.
                  </li>
                  <li>
                    Track record: performance + reliability wins, migrations, and mentoring teams.
                  </li>
                </ul>
              </div>
            </details>
          </div>

          <Card className="print:shadow-none">
            <CardHeader>
              <CardTitle>Recruiter snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Team Lead (Carvana) — AI communications platform</li>
                <li>• Scala (ZIO/Akka), Python, TypeScript, SQL</li>
                <li>• Kafka / event-driven microservices</li>
                <li>• Kubernetes + Terraform, AWS + GCP</li>
                <li>• Observability: OpenTelemetry, Datadog, Grafana</li>
                <li>• Security: IAM, OIDC/SAML/SSO, secure messaging</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Core strengths (ATS-friendly)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold">Cloud & Infra</p>
                    <p className="text-sm text-muted-foreground">
                      AWS, GCP, Kubernetes, Terraform, CI/CD, serverless, containers, IaC
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Distributed systems</p>
                    <p className="text-sm text-muted-foreground">
                      Event-driven architecture, microservices, secure APIs, data pipelines, messaging
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Languages</p>
                    <p className="text-sm text-muted-foreground">
                      Scala, Python, Java, TypeScript/JavaScript, SQL, C#
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">AI / LLM systems</p>
                    <p className="text-sm text-muted-foreground">
                      LLM chat + routing, summarization pipelines, human-in-the-loop workflows, AI-assisted engineering
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Reliability & Observability</p>
                    <p className="text-sm text-muted-foreground">
                      Kafka, ZIO, Akka, OpenTelemetry, Datadog, Grafana
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Leadership</p>
                    <p className="text-sm text-muted-foreground">
                      Architecture reviews, RFCs, mentoring, cross-stack collaboration, execution ownership
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected impact</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <span className="font-semibold text-foreground">Carvana — AI Chat Platform:</span> Helped architect an
                    LLM-based communications platform; led platform team delivery of new features to production.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Carvana — Performance:</span> Reduced a critical chat backend span
                    by <strong>~10×</strong> (from 1s+ to ~90ms) using caching and pooled Twilio identities.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Observability at scale:</span> Implemented end-to-end tracing across
                    UI → gateways → microservices → AI flows with OpenTelemetry.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Workiva — Serverless + SSO:</span> Built SSO/SAML/OIDC gateways and
                    serverless integrations on AWS.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-gradient-to-b from-background to-accent/10">
        <Container>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
            <p className="text-sm text-muted-foreground">
              Prefer a 1-page view? Use Print / Save PDF.
            </p>
          </div>
          <Divider className="my-6" />

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <ExternalA href={COMPANIES.carvana.url}>{COMPANIES.carvana.name}</ExternalA>
                    <span className="text-muted-foreground">— Senior Engineer II → Team Lead (AI Communications Platform)</span>
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Aug 2022 – Jun 2025 · Remote</p>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>
                    Led backend transformation of customer communications: AI-driven chat, routing, and orchestration between
                    LLMs and human agents.
                  </li>
                  <li>
                    Architected event-driven systems with <strong>Scala/ZIO/Akka</strong>; migrated Kafka workloads to
                    <strong> Confluent Cloud</strong>.
                  </li>
                  <li>
                    Designed LLM summarization pipelines and secure messaging infrastructure (privacy-aware data handling,
                    safe API design).
                  </li>
                  <li>
                    Implemented distributed tracing across UI → gateways → microservices → AI flows via
                    <strong> OpenTelemetry</strong>.
                  </li>
                  <li>
                    Achieved a ~10× latency reduction on a critical backend span through caching and pooled Twilio identities.
                  </li>
                  <li>
                    Advanced AI-first engineering workflows (Copilot, agentic tools) to improve team throughput and feedback loops.
                  </li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Scala",
                    "ZIO",
                    "Akka",
                    "Kafka",
                    "Python",
                    "GCP",
                    "Kubernetes",
                    "Terraform",
                    "OpenTelemetry",
                    "Datadog",
                    "Grafana",
                  ].map((t) => (
                    <Badge key={t} variant="outline" pill>
                      {t}
                    </Badge>
                  ))}
                </div>

                <details className="mt-4 rounded-lg border border-border/60 bg-background/40 p-4">
                  <summary className="cursor-pointer text-sm font-semibold">
                    Hiring manager / systems deep-dive
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground space-y-2">
                    <p>
                      Focus areas included event-driven orchestration, safe fallbacks for human escalation, and reliability
                      guardrails (timeouts, backpressure, and tracing-based troubleshooting). Emphasis on security and
                      observability to keep AI flows debuggable in production.
                    </p>
                  </div>
                </details>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <ExternalA href={COMPANIES.smartthings.url}>{COMPANIES.smartthings.name}</ExternalA>
                    <span className="text-muted-foreground">— Senior Software Engineer</span>
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Jun 2021 – Aug 2022 · Minneapolis, MN</p>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Designed identity and access services for a global IoT platform.</li>
                  <li>Built high-throughput Scala/Groovy services with Akka and Spring Security.</li>
                  <li>Managed AWS infrastructure with Terraform; improved operability with Datadog + Sumo Logic.</li>
                  <li>Supported mission-critical 24/7 platform spanning US and Korea.</li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Scala", "Akka", "Spring Security", "AWS", "Terraform", "Datadog"].map((t) => (
                    <Badge key={t} variant="outline" pill>
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <ExternalA href={COMPANIES.workiva.url}>{COMPANIES.workiva.name}</ExternalA>
                    <span className="text-muted-foreground">— Senior Software Engineer</span>
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Dec 2013 – Jun 2021 · Ames, IA</p>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Drove platform and IAM initiatives across internal tools and customer-facing systems.</li>
                  <li>Built SSO/SAML/OIDC gateways (Python/Flask on AWS Lambda) for SaaS integrations.</li>
                  <li>
                    Developed an internal video streaming platform that scaled to <strong>2,000 users</strong> within minutes.
                  </li>
                  <li>Delivered backend services with AWS Lambda, Kinesis, Redshift, and relational databases.</li>
                  <li>Mentored engineers and reviewed designs across multiple backend teams.</li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Python",
                    "Flask",
                    "AWS Lambda",
                    "OIDC",
                    "SAML",
                    "Kinesis",
                    "Redshift",
                    "PostgreSQL",
                    "MySQL",
                  ].map((t) => (
                    <Badge key={t} variant="outline" pill>
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <ExternalA href={COMPANIES.twoRivers.url}>{COMPANIES.twoRivers.name}</ExternalA>
                    <span className="text-muted-foreground">— Senior Web Developer / Architect</span>
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Nov 2007 – Nov 2013 · Des Moines, IA</p>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Built enterprise web applications and CMS-backed platforms for Fortune 500 clients.</li>
                  <li>Led migration from proprietary frameworks to open-source CMS, improving developer efficiency.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earlier roles</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Vodaci Technologies — Software Engineer (C#, VB, SQL Server, infra support)</li>
                  <li>• Customer Ease — Director of Technical Service (startup generalist, full-stack & infra)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  <ExternalA href={COMPANIES.drake.url}>{COMPANIES.drake.name}</ExternalA> — B.A. Computer Science, Biology
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interests (human section)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Guitar & music</li>
                  <li>• Tabletop gaming & miniature painting</li>
                  <li>• Running the battery out of my e-bike</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Links</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prefer a PDF? Click <span className="font-semibold">Print / Save PDF</span>.
              For recruiters: this page is intentionally structured for ATS parsing and quick scanning.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <ExternalA href={LINKS.linkedin}>LinkedIn</ExternalA>
              <ExternalA href={LINKS.github}>GitHub</ExternalA>
              <ExternalA href={LINKS.portfolio}>Portfolio</ExternalA>
              <a className="text-primary underline underline-offset-4" href={LINKS.email}>
                Email
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="bg-gradient-to-b from-background to-accent/10">
        <Container>
          <Card id="resume-plain-text" className="scroll-mt-24">
            <CardHeader>
              <CardTitle>Plain text (copy/paste for applications)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Some ATS systems still love plain text. This mirrors the structured sections above.
              </p>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <h3>Ian Lintner — Lead Engineer</h3>
                <p>
                  Minneapolis, MN · lintner.ian@gmail.com · 515-360-4655\n
                  LinkedIn: {LINKS.linkedin}\n
                  GitHub: {LINKS.github}\n
                  Portfolio: {LINKS.portfolio}
                </p>
                <h4>Summary</h4>
                <p>
                  Lead Engineer with 20+ years building secure, event-driven, cloud-native systems. Strengths in Scala (ZIO/Akka),
                  Kafka, Kubernetes, Terraform, OpenTelemetry, and LLM-enabled products.
                </p>
                <h4>Core Skills</h4>
                <p>
                  Distributed Systems; Event-driven Architecture; Microservices; Secure APIs; IAM; SSO/OIDC/SAML; Observability;
                  OpenTelemetry; Datadog; Grafana; Kafka; Kubernetes; Terraform; AWS; GCP; Scala; ZIO; Akka; Python; TypeScript; SQL.
                </p>
                <h4>Experience</h4>
                <p>
                  Carvana — Senior Engineer II → Team Lead (AI Communications Platform), Aug 2022 – Jun 2025\n
                  Samsung SmartThings — Senior Software Engineer, Jun 2021 – Aug 2022\n
                  Workiva — Senior Software Engineer, Dec 2013 – Jun 2021\n
                  Two Rivers Marketing — Senior Web Developer / Architect, Nov 2007 – Nov 2013
                </p>
                <h4>Education</h4>
                <p>Drake University — B.A. Computer Science, Biology</p>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Looking for a shorter version? See the “Phone screen version” section near the top.
                Want more detail? Expand the deep-dive sections under roles.
              </p>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary underline underline-offset-4">
              Back to home
            </Link>
          </p>
        </Container>
      </Section>
    </div>
  );
}
