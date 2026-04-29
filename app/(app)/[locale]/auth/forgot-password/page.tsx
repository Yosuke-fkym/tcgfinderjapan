"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import shopBg from  "@/assets/japan-bg-poster.png"
import { Loader2, Mail } from "lucide-react";
import { supabaseClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const { locale } = useParams();
  const t = getT(locale as string);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) return alert(t.auth.forgetPassword.requiredEmail || "Enter your email");

    setLoading(true);

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      alert(t.auth.forgetPassword.error || "Something went wrong");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      
      {/* 🌆 Background */}
     <div
  className="absolute inset-0 bg-center bg-cover bg-no-repeat"
 style={{ backgroundImage: `url(${shopBg.src})` }}
/>
        <div className="absolute inset-0 bg-black/60" />

      {/* 🧾 Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-white">
              {t.auth.forgetPassword.forgotTitle || "Forgot Password"}
            </h1>
            <p className="text-sm text-gray-400">
              {t.auth.forgetPassword.forgotDesc ||
                "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {/* Success state */}
          {sent ? (
            <div className="text-center text-green-400 text-sm">
              {t.auth.forgetPassword.resetSent || "Reset link sent! Check your email."}
            </div>
          ) : (
            <>
              {/* Input */}
              <div className="relative flex items-center">
                <Mail size={20} className="absolute left-3  w-4 h-4 text-gray-400" />

                <input
                  type="email"
                  placeholder={t.auth.forgetPassword.email || "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-black/60 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Button */}
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 rounded-lg font-medium text-white disabled:opacity-60"
              >
                        {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-4 h-4" />
                      {t.auth.forgetPassword.sending || "Sending..."}
                    </span>
                  ) : (
                    t.auth.forgetPassword.sendReset || "Send Reset Link"
                  )}
              </button>
            </>
          )}

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center">
            {t.auth.forgetPassword.backToLogin || "Remember your password?"}{" "}
            <a
              href={`/${locale}/auth/login`}
              className="text-indigo-400 hover:underline"
            >
              {t.auth.forgetPassword.login || "Login"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}