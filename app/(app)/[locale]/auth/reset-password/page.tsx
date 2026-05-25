"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getT } from "@/lib/getT";
import { Loader2, Lock } from "lucide-react";
import shopBg from  "@/assets/japan-bg-poster.png"
import { supabaseClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const { locale } = useParams();
  const router = useRouter();
  const t = getT(locale as string);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    if (!password || !confirm) {
      return alert(t.auth?.resetPassword.requiredPassword || "Please fill all fields");
    }

    if (password !== confirm) {
      return alert(t.auth?.resetPassword.passwordMismatch || "Passwords do not match");
    }

    setLoading(true);

    const { error } = await supabaseClient.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      
        console.log(error);
        
      alert(t.auth?.forgetPassword.error || "Failed to update password");
    } else {
      setSuccess(true);

      // optional redirect after 2s
      setTimeout(() => {
        router.push(`/${locale}/auth/login`);
      }, 2000);
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
              {t.auth?.resetPassword.resetTitle || "Reset Password"}
            </h1>
            <p className="text-sm text-gray-400">
              {t.auth?.resetPassword.resetDesc ||
                "Enter your new password below"}
            </p>
          </div>

          {/* Success */}
          {success ? (
            <div className="text-center text-green-400 text-sm">
              {t.auth?.resetPassword.resetSuccess ||
                "Password updated successfully! Redirecting..."}
            </div>
          ) : (
            <>
              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                <input
                  type="password"
                  placeholder={t.auth?.resetPassword.newPassword || "New password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-black/60 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                <input
                  type="password"
                  placeholder={t.auth?.resetPassword.confirmPassword || "Confirm password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-black/60 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Button */}
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 rounded-lg font-medium text-white disabled:opacity-60"
              >
               {loading ? (
  <span className="flex items-center gap-2">
    <Loader2 className="animate-spin w-4 h-4" />
    {t.auth?.resetPassword.updating || "Updating..."}
  </span>
) : (
  t.auth?.resetPassword.updatePassword || "Update Password"
)}
              </button>
            </>
          )}

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center">
            {t.auth?.forgetPassword.backToLogin || "Back to"}{" "}
            <a
              href={`/${locale}/auth/login`}
              className="text-indigo-400 hover:underline"
            >
              {t.auth?.forgetPassword.login || "Login"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}