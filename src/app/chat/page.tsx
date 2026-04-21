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
  Clock,
  Sparkles,
  Smile,
  Film,
  Gamepad2,
  BookOpen,
  Target,
} from "lucide-react";
import { ChatWidgetMount } from "./ChatWidgetMount";

export const metadata: Metadata = {
  title: "Cat-Herding AI — On-Hold Multi-Agent Chat | Ian Lintner",
  description:
    "A live on-hold entertainment demo: multi-agent chat that keeps you company while you wait, with goal-seeking agents (story teller, game host, YouTube guru, joke teller) and OAuth2 sign-in via the Rust OAuth2 Server.",
  keywords: [
    "chat widget",
    "multi-agent",
    "goal seeking",
    "on-hold",
    "OAuth2",
    "PKCE",
    "AI agents",
    "Rust",
    "React",
    "Socket.IO",
  ],
  openGraph: {
    title: "Cat-Herding AI — On-Hold Multi-Agent Chat",
    description:
      "Multi-agent chat that keeps you company while you wait. Live demo gated by OAuth2 + PKCE.",
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
            <Clock className="h-4 w-4" />
            <span>Live demo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            You&apos;re on hold.
            <br />
            Let the agents entertain you.
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            <strong className="text-foreground">Cat-Herding AI</strong> is a
            multi-agent chat backend I built to explore what happens when an LLM
            &ldquo;customer-service queue&rdquo; isn&apos;t elevator music —
            it&apos;s a rotation of specialist AI agents whose job is to keep
            you entertained until the thing you were actually waiting for
            arrives. Jokes. GIFs. YouTube picks. A round of 20 Questions. A
            bedtime story if it&apos;s that kind of night.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mt-4">
            Sign in through the bubble in the corner and the hold-flow
            bootstraps. The agents pass you around between themselves, each
            staying in character, each aware of the shared conversation — a
            small but honest multi-agent system with handoffs, goal-seeking, and
            rich tool use. The sign-in itself runs against my{" "}
            <Link
              href="/blog/rust-oauth2-server-progress-update-2026"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Rust OAuth2 Server
            </Link>{" "}
            over OAuth2 + PKCE, entirely in the browser.
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
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-6 w-6" />
          The scenario: 20 minutes on hold
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
          Pretend you called support, or you&apos;re queued for a long-running
          AI task, or a batch job kicks off at 3am. You have dead time. The
          classic product answer is &ldquo;show a spinner.&rdquo; The better
          product answer is &ldquo;give people something to do.&rdquo; This demo
          is me asking: what if the hold experience was itself the product?
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
          Concretely, when you sign in on this page the widget goes into{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted text-sm">
            mode: &apos;demo&apos;
          </code>{" "}
          and the backend runs its hold-flow bootstrap: a welcome, an
          introduction of the agents on shift, and a proactive opener from
          whichever agent matches the moment. Every other page on this site
          mounts the same widget in{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted text-sm">
            mode: &apos;lean&apos;
          </code>
          , so it sits quietly in the corner without pinging you until you click
          it.
        </p>
      </section>

      <section className="border-t">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            The agents on shift
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AgentCard
              icon={<Smile className="h-5 w-5" />}
              name="Joke Teller"
              body="Clean-ish one-liners, callbacks to earlier jokes in the conversation, won't run out."
            />
            <AgentCard
              icon={<Film className="h-5 w-5" />}
              name="YouTube Guru"
              body="Tool-driven: picks a curated video based on your vibe, embeds it inline via youtube-nocookie."
            />
            <AgentCard
              icon={<Gamepad2 className="h-5 w-5" />}
              name="Game Host"
              body="Runs 20 Questions, Would You Rather, trivia. Keeps score. Routes from ‘play a game’ intents."
            />
            <AgentCard
              icon={<BookOpen className="h-5 w-5" />}
              name="Story Teller"
              body="Short interactive fiction. Will not hallucinate images — that was a bug fix (PR #172, if you're curious)."
            />
            <AgentCard
              icon={<MessageSquare className="h-5 w-5" />}
              name="GIF Buddy"
              body="Reacts with a curated GIF when the vibe calls for one. Attachment flows through as an inline image."
            />
            <AgentCard
              icon={<Target className="h-5 w-5" />}
              name="Orchestrator"
              body="Picks which agent speaks next, issues `handoff_event` messages, keeps the conversation coherent across personas."
            />
          </div>
          <p className="text-sm text-muted-foreground mt-6 max-w-3xl">
            Under the hood these are separate prompt+tool bundles behind a
            router. Streaming is Socket.IO; each token arrives individually so
            you see the response typed out. Handoffs surface as{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-xs">
              handoff_event
            </code>{" "}
            frames and show up as a small &ldquo;Transferring you to
            <em>Agent Name</em>…&rdquo; message in the transcript.
          </p>
        </div>
      </section>

      <section className="border-t">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Goal-seeking without a monolith
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-3xl">
            Each agent has its own lane — jokes, games, videos, stories — but
            the system as a whole is goal-seeking: keep the user engaged, and
            track any explicit goal they mention (&ldquo;I just need a status
            update&rdquo;, &ldquo;I actually want to book a meeting&rdquo;) so
            the right escalation path is always one intent away. The router and
            the per-agent tools make it possible to add a new persona without
            teaching every other agent about it.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-3xl">
            I wrote about the broader pattern — small, cooperating, goal-aware
            agents instead of one giant prompt — in{" "}
            <Link
              href="/blog/goal-seeking-ai-architecture-multi-agent-systems"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Goal-Seeking AI Architecture
            </Link>
            . This widget is one of the reference implementations.
          </p>
        </div>
      </section>

      <section className="border-t">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-8">
            What&apos;s going on under the hood
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="OAuth2 + PKCE, all client-side"
              body="The widget runs the full Authorization Code + PKCE flow in the browser: popup opens roauth2.cat-herding.net, user signs in, the popup posts the code back, and a same-origin proxy on the chat backend exchanges it for a JWT. No client secret ships in the bundle."
            />
            <FeatureCard
              icon={<Boxes className="h-5 w-5" />}
              title="Multi-LLM backend"
              body="Claude (via Azure AI Foundry) + OpenAI for routing, tools, and rich media. Each agent is a prompt + tool bundle; the orchestrator picks who speaks next and issues handoffs."
            />
            <FeatureCard
              icon={<Cloud className="h-5 w-5" />}
              title="Kubernetes-native"
              body="Rust OAuth2 server and chat backend both run in AKS behind Istio — managed certs, JWT-aware AuthorizationPolicies, RequestAuthentication binding the token audience to chat-backend."
            />
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-6">
            The sign-in request path
          </h2>
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
              text="Widget stores the access token in sessionStorage, reconnects its Socket.IO client with the token in the handshake, and Istio RequestAuthentication validates the JWT against the in-cluster JWKS before forwarding to the chat backend. Hold flow starts."
            />
          </ol>
        </div>
      </section>

      <section className="border-t">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold mb-4">Embed it anywhere</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            The widget is a ~20 KB gzipped IIFE that mounts inside a Shadow DOM
            so host CSS can&apos;t bleed in. The same bundle is running on every
            page of this site right now — in{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-sm">lean</code>{" "}
            mode elsewhere,{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-sm">demo</code>{" "}
            mode here. Drop it into any site:
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
              href="/blog/goal-seeking-ai-architecture-multi-agent-systems"
              title="Goal-Seeking AI Architecture: Multi-Agent Systems"
            />
            <PostLink
              href="/blog/rust-oauth2-server-actor-model-security"
              title="Actor-Model Concurrency for Secure OAuth2"
            />
            <PostLink
              href="/blog/multi-agent-ai-parallel-execution-copilot-agents"
              title="Multi-Agent AI: Parallel Execution"
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

function AgentCard({
  icon,
  name,
  body,
}: {
  icon: React.ReactNode;
  name: string;
  body: string;
}) {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center gap-2 text-sm font-semibold mb-1.5">
        <span className="text-primary">{icon}</span>
        <span>{name}</span>
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
