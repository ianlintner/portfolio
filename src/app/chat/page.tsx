import { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquare,
  ShieldCheck,
  Boxes,
  Cloud,
  ArrowRight,
  Github,
  ExternalLink,
} from "lucide-react";
import { ChatWidgetMount } from "./ChatWidgetMount";

export const metadata: Metadata = {
  title: "Cat-Herding AI Chat | Ian Lintner",
  description:
    "A live multi-agent chat demo protected by the Rust OAuth2 Server. Sign in with the floating chat bubble to try the agents.",
  keywords: [
    "chat widget",
    "OAuth2",
    "PKCE",
    "AI agents",
    "Rust",
    "React",
    "Socket.IO",
  ],
  openGraph: {
    title: "Cat-Herding AI Chat",
    description:
      "Live multi-agent chat demo, gated by OAuth2 + PKCE against the Rust OAuth2 Server.",
    type: "website",
    url: "/chat",
  },
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <ChatWidgetMount />

      <section className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MessageSquare className="h-4 w-4" />
            <span>Live demo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Cat-Herding AI Chat
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            A floating chat widget, embedded right on this page, that connects
            to a multi-agent backend hosted at{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-sm">
              chat.cat-herding.net
            </code>
            . Access is gated by OAuth2 + PKCE against my own{" "}
            <Link
              href="/blog/rust-oauth2-server-progress-update-2026"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Rust OAuth2 Server
            </Link>
            . Click the bubble in the lower-right to sign in and start chatting.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://github.com/ianlintner/Example-React-AI-Chat-App"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90"
            >
              <Github className="h-4 w-4" />
              Chat app source
            </a>
            <a
              href="https://github.com/ianlintner/rust-oauth2-server"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-accent"
            >
              <Github className="h-4 w-4" />
              Auth server source
            </a>
            <a
              href="https://roauth2.cat-herding.net/.well-known/openid-configuration"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium hover:bg-accent"
            >
              <ExternalLink className="h-4 w-4" />
              OIDC discovery
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-8">
          What&apos;s going on here
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="OAuth2 + PKCE, all client-side"
            body="The widget runs the full Authorization Code + PKCE flow in the browser: popup opens roauth2.cat-herding.net, user signs in, the popup posts the code back, and a same-origin proxy on the chat backend exchanges it for a JWT. No client secret ships in the bundle."
          />
          <FeatureCard
            icon={<Boxes className="h-5 w-5" />}
            title="Multi-agent backend"
            body="Socket.IO streams tokens from a Node backend that routes prompts across several agent personas (story teller, game host, YouTube guru, joke teller…) backed by Azure AI Foundry and Claude. Rich media — GIFs, audio, YouTube embeds — flows through as tool calls."
          />
          <FeatureCard
            icon={<Cloud className="h-5 w-5" />}
            title="Kubernetes-native"
            body="Both the Rust OAuth2 server and the chat backend run in AKS behind Istio with managed certs, JWT-aware AuthorizationPolicies, and RequestAuthentication binding the audience to chat-backend."
          />
        </div>
      </section>

      <section className="border-t">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-6">The request path</h2>
          <ol className="space-y-4 text-muted-foreground leading-relaxed">
            <Step
              n={1}
              text="You click the floating chat bubble, then Sign in. The widget generates a PKCE verifier and challenge in the browser and opens a popup."
            />
            <Step
              n={2}
              text="Popup lands on roauth2.cat-herding.net/oauth/authorize. You authenticate (optionally via GitHub or Google federation) and approve the scopes."
            />
            <Step
              n={3}
              text="The auth server redirects the popup to chat.cat-herding.net/embed/callback.html with an authorization code. Callback postMessages the code back to the widget and closes."
            />
            <Step
              n={4}
              text="Widget POSTs {code, code_verifier} to a same-origin proxy on the chat backend that forwards to the issuer's /oauth/token and strips refresh_token before handing the JWT back."
            />
            <Step
              n={5}
              text="Widget stores the access token in sessionStorage, reconnects its Socket.IO client with the token in the handshake, and Istio RequestAuthentication validates the JWT against the in-cluster JWKS before forwarding to the chat backend."
            />
          </ol>
        </div>
      </section>

      <section className="border-t">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-4">Embed it anywhere</h2>
          <p className="text-muted-foreground mb-6">
            The widget is a ~20 KB gzipped IIFE that mounts inside a Shadow DOM
            so host CSS can&apos;t bleed in. Drop it into any site:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            <code>{`<script src="https://chat.cat-herding.net/embed/cat-herding-chat.js" defer></script>
<script>
  window.addEventListener('load', () => {
    window.CatHerdingChat.init({
      apiUrl: 'https://chat.cat-herding.net',
      mode: 'lean',
      auth: {
        type: 'oauth2',
        issuer: 'https://roauth2.cat-herding.net',
        clientId: 'cat-herding-chat-embed',
        scopes: 'openid profile email',
      },
    });
  });
</script>`}</code>
          </pre>
        </div>
      </section>

      <section className="border-t">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-4">Further reading</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <PostLink
              href="/blog/rust-oauth2-server-progress-update-2026"
              title="Rust OAuth2 Server: Four Months of Progress"
            />
            <PostLink
              href="/blog/rust-oauth2-server-actor-model-security"
              title="Actor-Model Concurrency for Secure OAuth2"
            />
            <PostLink
              href="/blog/oauth2-proxy-sidecar-decentralized-auth-pattern"
              title="OAuth2 Proxy Sidecar: Decentralized Auth"
            />
            <PostLink
              href="/blog/weekly-k6-benchmark-ci-trend-detection"
              title="Weekly k6 Benchmarks in CI"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="border rounded-lg p-5 bg-card">
      <div className="flex items-center gap-2 text-sm font-medium mb-2">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex gap-4">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold">
        {n}
      </span>
      <span className="pt-1">{text}</span>
    </li>
  );
}

function PostLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 border rounded-md px-4 py-3 hover:bg-accent transition-colors"
    >
      <span className="text-sm font-medium">{title}</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
