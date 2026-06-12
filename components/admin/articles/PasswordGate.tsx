// components/blog/PasswordGate.tsx
// Client component — shown when article is_protected and no valid cookie exists.
// Submits password to /api/articles/[slug]/verify which sets an httpOnly cookie.
// On success, triggers a full page reload so the server re-reads the cookie.

"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";

type Props = {
  slug: string;
  articleTitle: string;
};

export default function PasswordGate({ slug, articleTitle }: Props) {
  const [password,    setPassword]    = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const {locale}  =  useParams();
  const t = getT(locale as string)
  console.log(t);

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/articles/${slug}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Cookie is now set server-side — reload so the server
        // renders the full article instead of the gate.
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error ?? t.passwordGate.incorrectPassword);
        setLoading(false);
      }
    } catch {
      setError(t.passwordGate.somethingWentWrong);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-5">
      <div className="w-full max-w-md">

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#0F0F0F] flex items-center justify-center shadow-md">
            <Lock size={26} className="text-[#C8861A]" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-[#C8861A] mb-3">
            {t.passwordGate.protectedArticle}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F0F0F] leading-tight mb-3">
            {articleTitle}
          </h1>
          <p className="text-sm text-[#9A9489] leading-relaxed max-w-xs mx-auto">
           {t.passwordGate.description}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8E3DB] rounded-2xl px-8 py-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <label
                htmlFor="gate-password"
                className="block text-sm font-medium text-[#0F0F0F]"
              >
                {t.passwordGate.passwordLabel}
              </label>

              <div className="relative">
                <input
                  id="gate-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder={t.passwordGate.passwordPlaceholder}
                  autoFocus
                  autoComplete="current-password"
                  className={`
                    w-full h-11 px-4 pr-11 rounded-lg border bg-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-[#C8861A]/40 transition-colors
                    ${error
                      ? "border-red-400 focus:border-red-400"
                      : "border-[#E8E3DB] focus:border-[#C8861A]"
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9489] hover:text-[#0F0F0F] transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="
                w-full h-11 flex items-center justify-center gap-2
                bg-[#0F0F0F] text-white text-sm font-semibold rounded-lg
                hover:bg-[#1a1a1a] transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {t.passwordGate.verifying}
                </>
              ) : (
                <>
                 {t.passwordGate.unlockArticle}
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>
        </div>

        {/* Footer hint — Shopify-ready copy */}
        <p className="text-center text-xs text-[#9A9489] mt-6 leading-relaxed">
          {t.passwordGate.footerText}{" "}
          <span className="text-[#C8861A]">{t.passwordGate.needHelp}</span>
        </p>

      </div>
    </main>
  );
}