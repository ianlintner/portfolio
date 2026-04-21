"use client";

import { useEffect, useRef } from "react";

interface CatHerdingChatApi {
  init: (options: {
    apiUrl: string;
    title?: string;
    subtitle?: string;
    mode?: "lean" | "demo";
    accentColor?: string;
    auth?: {
      type: "oauth2";
      issuer: string;
      clientId: string;
      scopes?: string;
      tokenStorage?: "memory" | "session" | "local";
    };
  }) => unknown;
}

declare global {
  interface Window {
    CatHerdingChat?: CatHerdingChatApi;
  }
}

const EMBED_SCRIPT_URL =
  "https://chat.cat-herding.net/embed/cat-herding-chat.js";
const CHAT_API_URL = "https://chat.cat-herding.net";
const OAUTH2_ISSUER = "https://roauth2.cat-herding.net";
const OAUTH2_CLIENT_ID = "cat-herding-chat-embed";

export function ChatWidgetMount() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SCRIPT_URL}"]`,
    );

    const init = (): void => {
      if (!window.CatHerdingChat) return;
      window.CatHerdingChat.init({
        apiUrl: CHAT_API_URL,
        title: "Cat-Herding AI",
        subtitle: "Multi-agent demo",
        mode: "lean",
        accentColor: "#6366f1",
        auth: {
          type: "oauth2",
          issuer: OAUTH2_ISSUER,
          clientId: OAUTH2_CLIENT_ID,
          scopes: "openid profile email",
          tokenStorage: "session",
        },
      });
    };

    if (existing && window.CatHerdingChat) {
      init();
      return;
    }

    const tag = existing ?? document.createElement("script");
    if (!existing) {
      tag.src = EMBED_SCRIPT_URL;
      tag.defer = true;
      tag.async = true;
      document.body.appendChild(tag);
    }
    tag.addEventListener("load", init, { once: true });
  }, []);

  return null;
}
