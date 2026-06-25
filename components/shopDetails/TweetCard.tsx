"use client";

import { sanitizeXUsername } from "@/lib/helpers/sanitizeXUsername";
import { useEffect, useRef, useState } from "react";
import ShopXProfile from "./ShopXProfile";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement) => Promise<void>;
      };
    };
  }
}

// How long (ms) to wait before deciding the timeline failed to render.
const RENDER_TIMEOUT_MS = 6000;

interface TweetCardProps {
  username: string | null | undefined;
  shopName?: string | null;
}

export default function TweetCard({ username, shopName }: TweetCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanUsername = sanitizeXUsername(username);

  /**
   * "pending"  – widgets.js is loading / timeline is rendering
   * "loaded"   – iframe appeared → timeline is working
   * "failed"   – timeout elapsed, no iframe → show profile card only
   */
  const [status, setStatus] = useState<"pending" | "loaded" | "failed">(
    "pending"
  );

  useEffect(() => {
    if (!cleanUsername || !containerRef.current) return;

    const container = containerRef.current;
    let timeoutId: ReturnType<typeof setTimeout>;
    let observer: MutationObserver;

    const render = () => {
      container.innerHTML = "";

      const anchor = document.createElement("a");
      anchor.className = "twitter-timeline";
      anchor.href = `https://twitter.com/${cleanUsername}`;
      // Keep textContent empty so the raw "Posts by @x" string is never visible
      anchor.textContent = "";
      anchor.setAttribute("data-theme", "dark");
      anchor.setAttribute("data-height", "600");

      container.appendChild(anchor);

      observer = new MutationObserver(() => {
        if (container.querySelector("iframe")) {
          clearTimeout(timeoutId);
          observer.disconnect();
          setStatus("loaded");
        }
      });

      observer.observe(container, { childList: true, subtree: true });

      timeoutId = setTimeout(() => {
        observer.disconnect();
        setStatus((prev) => (prev === "loaded" ? "loaded" : "failed"));
      }, RENDER_TIMEOUT_MS);

      window.twttr?.widgets?.load(container);
    };

    setStatus("pending");

    if (window.twttr?.widgets) {
      render();
    } else {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://platform.twitter.com/widgets.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", render, { once: true });
        return () => existingScript.removeEventListener("load", render);
      }

      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = render;
      document.body.appendChild(script);

      return () => {
        script.onload = null;
      };
    }

    return () => {
      clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [cleanUsername]);

  if (!cleanUsername) return null;

  return (
    // No background/border here — this wrapper is fully transparent.
    // Only the timeline iframe OR the ShopXProfileCard carries visual weight.
    <div className="w-full max-w-xl mx-auto">

      {/* Loading skeleton — only while pending */}
      {status === "pending" && (
        <div
          className="w-full h-48 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse"
          aria-label="Loading X timeline…"
        />
      )}

      {/* Timeline container — always mounted so widgets.js can inject.
          Invisible while pending (skeleton covers it), hidden if failed. */}
      <div
        ref={containerRef}
        className={
          status === "failed"
            ? "hidden"          // failed: completely removed from layout
            : status === "pending"
            ? "invisible h-0 overflow-hidden"  // pending: skeleton shows instead
            : "w-full"          // loaded: full width, visible
        }
        aria-hidden={status !== "loaded"}
      />

      {/* Profile card:
          - "failed"  → only element visible, acts as full fallback
          - "loaded"  → shown below the timeline as a compact "Open on X" strip
          - "pending" → hidden                                                  */}
      {status !== "pending" && (
        <div className={status === "loaded" ? "mt-3" : ""}>
          <ShopXProfile username={cleanUsername} shopName={shopName} />
        </div>
      )}
    </div>
  );
}