"use client";

import { useEffect } from "react";

export interface ChatInitOptions {
  apiUrl: string;
  title?: string;
  subtitle?: string;
  mode?: "lean" | "demo";
  accentColor?: string;
  openOnLoad?: boolean;
  welcomeMessage?: string | null;
  auth?: {
    type: "oauth2";
    issuer: string;
    clientId: string;
    scopes?: string;
    tokenStorage?: "memory" | "session" | "local";
  };
}

interface WidgetInstance {
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
  destroy?: () => void;
}

interface CatHerdingChatApi {
  init: (options: ChatInitOptions) => WidgetInstance | void;
  widget?: WidgetInstance;
}

declare global {
  interface Window {
    CatHerdingChat?: CatHerdingChatApi;
  }
}

const EMBED_SCRIPT_URL =
  "https://chat.cat-herding.net/embed/cat-herding-chat.js";

export const CHAT_DEFAULTS = {
  apiUrl: "https://chat.cat-herding.net",
  issuer: "https://roauth2.cat-herding.net",
  clientId: "cat-herding-chat-embed",
  scopes: "openid profile email",
} as const;

/**
 * Sitewide mounter for the Cat-Herding chat widget.
 *
 * Loads the remote bundle once, initializes with `lean` mode by default so
 * no unsolicited hold-flow proactive messages fire on random pages. Pages
 * that want the full demo can re-initialize with `{ mode: 'demo' }` — the
 * widget's `init()` destroys any prior instance first, so a second call
 * from `/chat` simply swaps modes.
 */
export function ChatWidgetLoader({
  options,
}: {
  options?: Partial<ChatInitOptions>;
} = {}) {
  useEffect(() => {
    const init = (): void => {
      if (!window.CatHerdingChat) return;
      window.CatHerdingChat.init({
        apiUrl: CHAT_DEFAULTS.apiUrl,
        title: "Cat-Herding AI",
        subtitle: "Multi-agent demo",
        mode: "lean",
        accentColor: "#6366f1",
        auth: {
          type: "oauth2",
          issuer: CHAT_DEFAULTS.issuer,
          clientId: CHAT_DEFAULTS.clientId,
          scopes: CHAT_DEFAULTS.scopes,
          tokenStorage: "session",
        },
        ...options,
      });
    };

    if (window.CatHerdingChat) {
      init();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SCRIPT_URL}"]`,
    );
    const tag = existing ?? document.createElement("script");
    if (!existing) {
      tag.src = EMBED_SCRIPT_URL;
      tag.defer = true;
      tag.async = true;
      document.body.appendChild(tag);
    }
    tag.addEventListener("load", init, { once: true });
  }, [options]);

  return null;
}
