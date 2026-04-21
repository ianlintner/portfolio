"use client";

import { useEffect } from "react";
import { CHAT_DEFAULTS } from "@/components/ChatWidgetLoader";

/**
 * On the /chat page we re-initialize the already-loaded widget with
 * `mode: 'demo'` so the hold-flow bootstrap fires (jokes, GIFs, YouTube
 * picks, games) to actually demonstrate multi-agent coordination.
 *
 * The widget's `init()` destroys any prior instance first, so the
 * sitewide lean loader in the root layout is cleanly replaced while the
 * user is on this page.
 */
export function ChatWidgetMount() {
  useEffect(() => {
    let disposed = false;

    const swapToDemo = (): void => {
      if (disposed || !window.CatHerdingChat) return;
      const instance = window.CatHerdingChat.init({
        apiUrl: CHAT_DEFAULTS.apiUrl,
        title: "Cat-Herding AI",
        subtitle: "Hold-flow demo",
        mode: "demo",
        accentColor: "#6366f1",
        openOnLoad: true,
        welcomeMessage:
          "You're on hold. Sign in and the agents will keep you company — jokes, GIFs, YouTube, games, whatever keeps your wait interesting.",
        auth: {
          type: "oauth2",
          issuer: CHAT_DEFAULTS.issuer,
          clientId: CHAT_DEFAULTS.clientId,
          scopes: CHAT_DEFAULTS.scopes,
          tokenStorage: "session",
        },
      });
      if (instance && typeof instance === "object" && "open" in instance) {
        instance.open?.();
      }
    };

    if (window.CatHerdingChat) {
      swapToDemo();
    } else {
      const interval = setInterval(() => {
        if (window.CatHerdingChat) {
          clearInterval(interval);
          swapToDemo();
        }
      }, 100);
      return () => {
        disposed = true;
        clearInterval(interval);
      };
    }

    return () => {
      disposed = true;
      if (window.CatHerdingChat) {
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
        });
      }
    };
  }, []);

  return null;
}
