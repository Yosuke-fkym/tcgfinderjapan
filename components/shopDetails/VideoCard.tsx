"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: any;
  }
}

export function VideoCard({ url }: { url: string }) {
  useEffect(() => {
    if (!window.instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.instgrm.Embeds.process();
    }
  }, [url]);

  return (
    <div className="w-fit shrink-0 rounded-2xl bg-white border shadow-sm">
      <div
  role="region"
  aria-label="Instagram post"
>
  
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          width: "80%",
          minWidth: "!important",
          margin: 0,
        }}
        />
        </div>
    </div>
  );
}