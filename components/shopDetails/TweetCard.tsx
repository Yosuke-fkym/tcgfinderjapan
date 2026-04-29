"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function TweetEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);

  const fixedUrl = url.replace("x.com", "twitter.com");

  useEffect(() => {
    const load = () => {
      if ((window as any).twttr) {
        (window as any).twttr.widgets.load();
      } else {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
          (window as any).twttr.widgets.load();
        };
        document.body.appendChild(script);
      }

      // 👇 delay after render
      setTimeout(() => setLoaded(true), 800);
    };

    load();
  }, [url]);

  return (
   <div className="w-full max-w-xl mx-auto relative">

  {!loaded && (
    <div className="absolute inset-0 flex items-center justify-center">
      <Loader2 className="animate-spin text-white" />
    </div>
  )}

  <div
    className={`transition-opacity duration-300 ${
      loaded ? "opacity-100" : "opacity-0"
    }`}
  >
    <blockquote
      className="twitter-tweet m-0 w-full"
      data-theme="dark"
    >
      <a href={fixedUrl}></a>
    </blockquote>
  </div>
</div>
  );
}