---
title: "🔐 Don't Trust a Black Box: Spec-Driven OAuth2 Conformance for Coding Agents"
date: 2026-11-24
excerpt: "How we built a language-neutral OAuth2 conformance contract so AI coding agents can implement and verify security-critical auth servers across Rust, Python, TypeScript, and Go without trusting third-party black boxes."
tags:
  [
    "OAuth2",
    "OIDC",
    "Security",
    "AI",
    "Rust",
    "Conformance",
    "Agents",
    "Engineering",
  ]
author: "Ian Lintner"
image: "/images/executable-specs-oauth2-conformance-agents-social.png"
imageAlt: "Spec-driven OAuth2 conformance contract verifying Rust, Python, TypeScript, and Go servers over black-box HTTP"
---

# 🔐 Don't Trust a Black Box: Spec-Driven OAuth2 Conformance for Coding Agents

For twenty years, the standard advice for authentication has been simple: never roll your own OAuth2 server.

Buy a managed identity provider, drop in a third-party library, and move on.

That advice existed for a good reason. OAuth 2.0 and OpenID Connect aren't one spec. They're a pile of interacting RFCs: core grants (RFC 6749), PKCE (RFC 7636), token revocation (RFC 7009), introspection (RFC 7662), issuer identification to stop mix-up attacks (RFC 9207), DPoP sender-constrained tokens (RFC 9449), and the OAuth 2.0 Security Best Current Practice (RFC 9700), plus dozens of extensions. Getting the happy path working takes an afternoon. Getting the failure modes right across every edge case used to take a dedicated team.

So most teams outsourced it. You hand your authentication boundary to a third-party vendor or a sprawling framework, hope their defaults match your threat model, and accept that you can't easily inspect or test every security invariant yourself.

I think that trade-off is starting to shift. Not because LLMs write bug-free security code on the first try (they definitely don't), but because **an executable, RFC-traced conformance suite turns security implementation into a verifiable engineering loop**.

Over the last couple of months, I've been testing that idea in public across five repositories: one shared specification and black-box runner (**[`oauth2-conformance`](https://github.com/ianlintner/oauth2-conformance)**) and four independent OAuth2/OIDC server implementations in Rust, Python, TypeScript, and Go.

---

## 🚨 Why "just build OAuth2" breaks down with agents

If you tell a coding agent to build an OAuth2 server—or even to port an existing Rust server into Go or TypeScript—you hit the same failure modes fast:

- **Tests drift.** Copy fixtures from one repo into another and within two weeks they test subtly different things.
- **Bugs get cloned.** If your reference server has a quiet RFC violation, an agent porting it line-for-line will faithfully reproduce the vulnerability in every new language.
- **False passes hide gaps.** Early in our TypeScript port, we learned the hard way that a harness that quietly skips unconfigured scenarios looks green in CI while verifying nothing.
- **Self-reported confidence is worthless.** An agent telling you "PKCE and token revocation are implemented" means very little until an independent black-box client tries to break them over HTTP.

If you want agents to write security-critical code, the prompt can't be the spec. The spec has to be versioned, machine-checked, and completely outside the implementation repository.

---

## 🧠 Making the specification the product

That's what [`oauth2-conformance`](https://github.com/ianlintner/oauth2-conformance) is for. It follows one simple rule:

> **The spec defines. The runner verifies. Agents iterate.**

Instead of letting each server carry its own ad-hoc integration tests, the contract lives in one language-neutral repository with three pieces:

1. **A normative requirements catalog (`requirements/`).** Thirty-nine YAML files mapping 443 requirements (330 `MUST` / `MUST NOT` rules) directly to RFC clauses and links. Every requirement gets a stable ID and belongs to a named profile (`core`, `token-lifecycle`, `oidc-basic`, `extended-grants`, `sender-constrained`, `hardening`, `resource`, `operations`, `admin-api`, `fapi2`, `pkce`).
2. **Declarative black-box scenarios (`scenarios/`).** Plain YAML files validated against JSON Schema 2020-12 (`schemas/*.json`) in CI. Adding a new security check doesn't require writing runner code.
3. **One shared black-box runner (`runner/`).** A single TypeScript HTTP runner that talks to the system under test strictly over the network. It never imports server code and never touches the database.

```mermaid
flowchart TD
  C["oauth2-conformance: 39 RFC catalogs, 192 YAML scenarios, 1 runner"] -->|Pinned commit SHA| R[rust-oauth2-server]
  C -->|Pinned commit SHA| P[python-oauth2-server]
  C -->|Pinned commit SHA| T[typescript-oauth2-server]
  C -->|Pinned commit SHA| G[go-oauth2-server]
  R -->|CI runs claimed profiles| V[JSON conformance report]
  P -->|CI runs claimed profiles| V
  T -->|CI runs claimed profiles| V
  G -->|CI runs claimed profiles| V
  V -->|Failing stable scenario| F[Red build -> Agent fixes code]
  V -->|RFC disagrees with Rust| D[Recorded reference-deviation]

  style C fill:#dbeafe,stroke:#1e40af
  style V fill:#dcfce7,stroke:#166534
```

### What a security requirement looks like on the wire

Take RFC 6749 section 4.1.2 (reinforced by RFC 9700 section 4.2.4): if an attacker replays an authorization code that was already exchanged, the server shouldn't just reject the replay. RFC 6749 says it SHOULD revoke the access and refresh tokens issued from the legitimate first exchange (when possible); the BCP tightens that guidance, and this contract makes it a stable requirement.

In `oauth2-conformance`, that rule isn't buried in prose or trapped inside one language's unit tests. It's a declarative scenario (`scenarios/token-lifecycle/revocation/code-replay-revokes-tokens.yaml`) that any server has to survive over HTTP:

```yaml
id: token-lifecycle.revocation.code-replay-revokes-tokens
title: "Replaying an authorization code makes the first exchange's access and refresh tokens unusable"
requirements: [RFC9700-2.1.1-code-replay-revokes-tokens]
profile: token-lifecycle
status: stable
steps:
  - id: auth
    use: login-and-authorize
    with:
      username: alice
      password: test-only-password
      loginPath: /auth/login
      authorizePath: /oauth/authorize
      query:
        response_type: code
        client_id: client-a
        redirect_uri: https://client.example/callback
        state: s-cov1
        scope: read
        code_challenge: E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
        code_challenge_method: S256
    expect:
      status: 302
    capture:
      code: redirect.query.code
  - id: exchange
    request:
      method: POST
      path: /oauth/token
      headers: { authorization: "Basic Y2xpZW50LWE6dGVzdC1vbmx5LXNlY3JldA==" }
      form:
        grant_type: authorization_code
        code: "{{code}}"
        redirect_uri: https://client.example/callback
        code_verifier: dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
    expect:
      status: 200
      json: { access_token: "x" }
    capture:
      at: body.access_token
      rt: body.refresh_token
  - id: replay
    request:
      method: POST
      path: /oauth/token
      headers: { authorization: "Basic Y2xpZW50LWE6dGVzdC1vbmx5LXNlY3JldA==" }
      form:
        grant_type: authorization_code
        code: "{{code}}"
        redirect_uri: https://client.example/callback
        code_verifier: dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
    expect:
      status: 400
      json: { error: invalid_grant }
  - id: access-token-inactive
    request:
      method: POST
      path: /oauth/introspect
      headers: { authorization: "Basic Y2xpZW50LWE6dGVzdC1vbmx5LXNlY3JldA==" }
      form: { token: "{{at}}" }
    expect:
      status: 200
      json: { active: false }
  - id: refresh-token-refused
    request:
      method: POST
      path: /oauth/token
      headers: { authorization: "Basic Y2xpZW50LWE6dGVzdC1vbmx5LXNlY3JldA==" }
      form: { grant_type: refresh_token, refresh_token: "{{rt}}" }
    expect:
      status: 400
      json: { error: invalid_grant }
```

That single YAML file gives an agent everything it needs: exact wire inputs, exact expected status codes and JSON payloads, and the RFC clause explaining why. No guessing.

---

## 🔌 The minimal SUT interface

To keep the runner black-box without making test setup painful, every server implements a small, test-mode-only System Under Test (SUT) interface:

- **Seed file (`OAUTH2_CONFORMANCE_SEED`).** On startup in conformance mode, the server loads a schema-validated `seed.yaml` containing test clients (public and confidential), redirect URIs, scopes, users, issuer URL, and signing keys.
- **Non-interactive test login.** A simple form login endpoint for seeded test users, enabled only in conformance mode. Startup must fail closed if conformance mode is turned on in a production profile.
- **Readiness and optional clock control.** A health endpoint the runner waits on, plus clock advancement for expiry tests.

Because every port speaks the same SUT interface, the same runner command works against Rust, Python, TypeScript, and Go without changing a line of test code.

---

## 🔒 How downstream repos pin and ratchet security

Each downstream server repo carries a `conformance.yaml` manifest at its root. Here's what `rust-oauth2-server/conformance.yaml` looks like:

```yaml
implementation: rust-oauth2-server
contract: b7620924068f32c8800cb23c8d47b6c1b2b6c583
profiles:
  [core, token-lifecycle, oidc-basic, extended-grants, sender-constrained]
```

In CI, the server builds, starts with `OAUTH2_CONFORMANCE_SEED`, checks out that exact pinned `oauth2-conformance` commit, and runs `pnpm conformance run` for every profile it claims. If any `stable` scenario fails, the build fails.

When a port still has known protocol gaps, it can declare them in a `deviations` list tied to specific requirements. That list works like a ratchet: an undeclared failure breaks CI as a regression, and once a bug is fixed, a deviation that stops failing has to be removed.

This is where the workflow actually pays off for agent-driven development. A contract update turns into a clean, mechanical loop for each downstream repo:

1. Bump the pinned contract SHA in `conformance.yaml` and `.github/workflows/ci.yml`.
2. Run the conformance runner locally against the server.
3. Fix every failing scenario until all claimed profiles pass.
4. Open a PR where CI re-runs the exact same suite and uploads the JSON conformance reports.

That loop caught real bugs right away. When we added `security-review coverage batch 1` (`b762092`) and bumped `rust-oauth2-server` to match, the new code-replay scenario exposed a subtle gap: access tokens weren't being revoked on code replay when no refresh grant had been issued (`ef491cb`). Later security review passes tightened client authentication method and secret handling, enforced client and user status on grant paths, and aligned introspection and revocation client auth. Every fix stayed locked in by the contract afterward.

---

## 🧪 Four proof-of-concept servers, one contract

All four implementations are open source and wired to the same contract:

| Repository                                                                           | Stack      | Role in the loop                                                |
| ------------------------------------------------------------------------------------ | ---------- | --------------------------------------------------------------- |
| [`rust-oauth2-server`](https://github.com/ianlintner/rust-oauth2-server)             | Rust       | Original reference implementation                               |
| [`python-oauth2-server`](https://github.com/ianlintner/python-oauth2-server)         | FastAPI    | Second validation target before promoting scenarios to `stable` |
| [`typescript-oauth2-server`](https://github.com/ianlintner/typescript-oauth2-server) | TypeScript | Origin of the extracted conformance runner                      |
| [`go-oauth2-server`](https://github.com/ianlintner/go-oauth2-server)                 | Go         | Independent fourth port exercising the same contract            |

Running multiple languages under one contract isn't just a stunt. It makes the spec sharper. Before a scenario gets promoted from `draft` to `stable`, we validate it against Rust and Python. When two independent implementations disagree on a test, we go back to the RFC. And if the Rust reference is the one that got it wrong, the RFC wins: the contract records a `reference-deviation` instead of baking Rust's mistake into the standard.

---

## 📊 Honesty over badges: where coverage actually stands

One rule I'm strict about in `oauth2-conformance` is **no false green**. The runner's own CI proves that mismatches, missing setup, and all-skipped suites exit nonzero. And `docs/STATUS.md` is auto-generated from the checked-out contract; CI fails if it goes stale.

Right now, the real numbers in `docs/STATUS.md` look like this:

| Profile                                                                 |  Stable | Reference-deviation |  Draft | MUST / MUST NOT covered by stable |
| :---------------------------------------------------------------------- | ------: | ------------------: | -----: | --------------------------------: |
| `core`                                                                  |      40 |                   2 |      2 |                     41 / 45 (91%) |
| `token-lifecycle`                                                       |      29 |                   7 |      1 |                     32 / 41 (78%) |
| `oidc-basic`                                                            |      13 |                   0 |      2 |                     11 / 30 (37%) |
| `sender-constrained`                                                    |       8 |                   0 |     27 |                      7 / 22 (32%) |
| `extended-grants`                                                       |       8 |                   1 |     42 |                      6 / 61 (10%) |
| `hardening`                                                             |       2 |                   0 |      2 |                      2 / 18 (11%) |
| Other profiles (`admin-api`, `fapi2`, `operations`, `pkce`, `resource`) |       0 |                   2 |      4 |                      0 / 113 (0%) |
| **Total**                                                               | **100** |              **12** | **80** |                **99 / 330 (30%)** |

All four ports currently claim `core`, `token-lifecycle`, `oidc-basic`, `extended-grants`, and `sender-constrained`.

Notice what that table does _not_ hide: `draft` scenarios are explicitly deferred and count for zero coverage. Passing `extended-grants` today proves the stable device-grant and PAR checks, not the 42 draft scenarios still waiting on runner helpers like client-assertion JWK signing. And passing this repo's suite isn't an official OpenID Foundation certification.

Being blunt about what is verified and what is still unverified is the whole point. A third-party vendor hands you a compliance PDF and asks you to trust it. An executable contract shows you the exact 99 `MUST`/`MUST NOT` clauses proven on every commit and the 231 clauses you still need to wire up.

---

## 🛠️ Why this pattern matters beyond my lab

`rust-oauth2-server` and its sibling ports are proofs of concept for a different way of building critical security infrastructure.

If you're an engineer who doesn't want to blindly trust a third-party auth service or an opaque library, you don't have to choose between "buy a black box" and "pray your hand-rolled code handles RFC 9207 `iss` URL-encoding correctly." You can:

1. **Own the specification as code.** Write your security requirements as RFC-traced, schema-validated YAML and black-box scenarios in a separate repo.
2. **Keep the runner outside the server.** Test strictly over HTTP so no mock or internal shortcut can fake a passing check.
3. **Let agents grind the implementation loop.** Coding agents are great at iterating against a deterministic, noisy, black-box test suite. Give them a pinned contract SHA and let CI reject anything that breaks an invariant.
4. **Keep humans on the spec and reviews.** Review the RFC requirements, review every `reference-deviation`, and approve the PRs. Let the contract and CI do the repetitive verification.

---

## ✅ Closing take

Whether you use the Rust server, fork one of the ports, or point `oauth2-conformance` at a brand-new server in your own stack, the leverage is in the contract.

Own the tests, verify every claim over the wire, and stop taking critical security guarantees on faith.

- Contract & runner: [github.com/ianlintner/oauth2-conformance](https://github.com/ianlintner/oauth2-conformance)
- Reference server: [github.com/ianlintner/rust-oauth2-server](https://github.com/ianlintner/rust-oauth2-server)
- Sibling ports: [python-oauth2-server](https://github.com/ianlintner/python-oauth2-server), [typescript-oauth2-server](https://github.com/ianlintner/typescript-oauth2-server), [go-oauth2-server](https://github.com/ianlintner/go-oauth2-server)
