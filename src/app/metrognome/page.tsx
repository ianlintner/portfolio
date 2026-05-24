import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Divider,
  PageHeader,
  Section,
  Grid,
} from "@ianlintner/theme";
import {
  ExternalLink,
  Volume2,
  Music,
  Gamepad2,
  ArrowLeft,
  Sparkles,
  Code,
  Shield,
  HelpCircle,
  Mail,
} from "lucide-react";
import { getAbsoluteUrl } from "@/lib/metadata";

const siteUrl = getAbsoluteUrl("/metrognome");

export const metadata: Metadata = {
  title: "Metrognome App Support & Information | Ian Lintner",
  description:
    "Official App Support, troubleshooting FAQ, and privacy information for Metrognome—the whimsical 3D Gnomecore Metronome.",
  openGraph: {
    title: "Metrognome App Support & Information",
    description:
      "Official App Support, troubleshooting FAQ, and privacy information for Metrognome—the whimsical 3D Gnomecore Metronome.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/images/metrognome-hero.png",
        width: 1024,
        height: 1024,
        alt: "Metrognome App Screenshot",
      },
    ],
  },
};

export default function MetrognomeAppPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Back navigation */}
      <div className="border-b bg-background/50 backdrop-blur">
        <Container className="py-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to About
          </Link>
        </Container>
      </div>

      {/* Hero / Header Section */}
      <Section
        spacing="lg"
        className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background border-b py-16"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side: Text details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold">
                <Sparkles className="h-3 w-3" />
                Metrognome Support Page
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Metrognome
              </h1>
              <p className="text-xl text-primary font-semibold">
                Whimsical 3D Metronome — App Support & Info
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Metrognome is a cozy 3D rhythm utility where colorful garden
                gnomes stand in a peaceful mushroom grove and bounce dynamically
                to your chosen beat. This page provides official support,
                answers to common questions, and developer contact details.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://growlbear.itch.io/metrognomes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg text-base font-semibold transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 h-12 px-6"
                >
                  Play on Itch.io
                  <ExternalLink className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/ianlintner/metrognome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg text-base font-semibold transition-all duration-300 border border-border bg-background hover:bg-accent h-12 px-6"
                >
                  <Code className="h-5 w-5" />
                  View Source Code
                </a>
              </div>
            </div>

            {/* Right side: App Mockup / Screenshot */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative glass-glow p-2 rounded-2xl overflow-hidden max-w-md shadow-2xl">
                <Image
                  src="/images/metrognome-hero.png"
                  alt="Metrognome 3D Grove Screen"
                  width={500}
                  height={500}
                  className="rounded-xl w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Primary Support & FAQ Section */}
      <Section spacing="lg">
        <Container className="max-w-4xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
              Troubleshooting & Support
            </h2>
            <p className="text-muted-foreground">
              If you have any questions, feedback, or need troubleshooting
              assistance, please read the FAQ below or reach out to our support
              channel.
            </p>
          </div>

          <div className="space-y-8">
            {/* Contact details */}
            <Card className="glass-glow border-primary/35">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Get Customer & Technical Support
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  For support inquiries, bug reports, feature requests, or
                  questions regarding the Metrognome app, please send an email
                  to our support team. We aim to review and respond to all
                  support emails within 2 to 3 business days.
                </p>
                <div className="rounded-lg bg-accent/25 p-4 border border-accent/30 space-y-1">
                  <span className="block text-xs text-muted-foreground uppercase tracking-wider">
                    Official Support Email
                  </span>
                  <a
                    href="mailto:dev@codelintner.com"
                    className="text-primary hover:underline font-semibold text-base inline-flex items-center gap-1.5"
                  >
                    dev@codelintner.com
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* FAQs */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                <div className="border border-border rounded-lg p-5 bg-card/40 hover:bg-card/60 transition-colors">
                  <h4 className="font-semibold text-foreground mb-1">
                    How do I start and stop the metronome?
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Use the prominent Play/Pause buttons in the control panel at
                    the bottom of the screen. When the metronome is active, the
                    gnomes will begin bouncing to the beats.
                  </p>
                </div>

                <div className="border border-border rounded-lg p-5 bg-card/40 hover:bg-card/60 transition-colors">
                  <h4 className="font-semibold text-foreground mb-1">
                    How do I change the time signature?
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Metrognome supports multiple time signatures including 2/4,
                    3/4, 4/4, 5/4, 6/8, and 7/8. Select your desired time
                    signature from the dropdown in the control panel, and the
                    row of gnomes will instantly update to match the number of
                    beats in a measure (e.g. 5 gnomes for 5/4).
                  </p>
                </div>

                <div className="border border-border rounded-lg p-5 bg-card/40 hover:bg-card/60 transition-colors">
                  <h4 className="font-semibold text-foreground mb-1">
                    Why is the opossum not moving?
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The opossum wanders around the grove only while the
                    metronome is playing. If the metronome is paused or stopped,
                    the opossum remains stationary.
                  </p>
                </div>

                <div className="border border-border rounded-lg p-5 bg-card/40 hover:bg-card/60 transition-colors">
                  <h4 className="font-semibold text-foreground mb-1">
                    What is the Privacy Policy for Metrognome?
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We collect no personal data. Metrognome operates entirely
                    locally on your device and does not require an account, ads,
                    or tracking. Anonymized crash telemetry may be shared via
                    Apple App Store services if you have opted in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Feature highlights */}
      <Section spacing="lg" className="border-t bg-accent/5">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Application Architecture Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              A quick technical breakdown of what makes Metrognome work.
            </p>
          </div>

          <Grid cols={{ base: 1, md: 3 }} gap={6}>
            <Card className="glass hover:border-primary/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Volume2 className="h-5 w-5" />
                  Procedural Audio Synth
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                Rather than loading pre-recorded `.wav` samples, Metrognome
                builds sound waves in memory using Godot&apos;s raw audio
                generators. Sound decays exponentially to produce clean clicks,
                woody blocks, or electronic beeps dynamically.
              </CardContent>
            </Card>

            <Card className="glass hover:border-primary/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Music className="h-5 w-5" />
                  Visual Beat Mapping
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                One garden gnome is instantiated for each beat in the measure.
                On the downbeat or accented beats, the corresponding gnome
                performs a high vertical arc bounce, giving you clear visual
                queues alongside the auditory tick.
              </CardContent>
            </Card>

            <Card className="glass hover:border-primary/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Gamepad2 className="h-5 w-5" />
                  Animated Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                Mushrooms are arranged procedurally using clearance constraints
                so they never block the camera. A curious opossum wanders the
                grove following a randomized curvy path, and frogs look on,
                creating a cozy environment.
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Tech Specifications */}
      <Section spacing="lg" className="border-t">
        <Container className="max-w-4xl">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground">
              Technical Specifications
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Metrognome was built using **Godot 4.6** and written entirely in
              **GDScript**. The project demonstrates modular, object-oriented
              scripting for procedural layouts and math-driven animations, as
              well as direct memory manipulation for sound frame population.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-card border border-border">
                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Engine
                </span>
                <span className="font-semibold text-foreground text-sm">
                  Godot 4.6
                </span>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Language
                </span>
                <span className="font-semibold text-foreground text-sm">
                  GDScript
                </span>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Platforms
                </span>
                <span className="font-semibold text-foreground text-sm">
                  Web, PC, Android
                </span>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  License
                </span>
                <span className="font-semibold text-foreground text-sm">
                  MIT
                </span>
              </div>
            </div>

            <Divider className="my-6" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-6 rounded-xl">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacy & Support Guidelines
                </h4>
                <p className="text-xs text-muted-foreground">
                  Our apps contain no ads or tracking. View terms and get email
                  support.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/90 transition-colors"
              >
                About & Support Policy
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
