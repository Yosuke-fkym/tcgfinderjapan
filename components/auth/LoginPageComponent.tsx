"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getT } from "@/lib/getT";
import shopBg from  "@/assets/japan-bg-poster.png"

export default function LoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { locale } = useParams();
  const t = getT(locale as string);

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error(t.auth.login.required);
    }

    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      toast.error(data.error);
      return;
    }

    toast.success(t.auth.login.success);
    router.push(`/${locale}/map`);
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

          {/* 🔙 Back */}
          <button
            onClick={() => router.push(`/${locale}/map`)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            {t.auth.common.back}
          </button>

          {/* 🏷 Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">
              {t.auth.login.title}
            </h1>
            <p className="text-sm text-gray-400">
              {t.auth.login.subtitle}
            </p>
          </div>

          {/* 📥 Inputs */}
          <div className="space-y-4">
            <form
  onSubmit={(e) => {
    e.preventDefault();
    handleLogin();
  }}
  className="space-y-4"
>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t.auth.common.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-black/60 py-5 border-white/20 text-white placeholder:text-gray-500 focus:border-indigo-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t.auth.common.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 py-5 bg-black/60 border-white/20 text-white placeholder:text-gray-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

          {/* 🔘 Button */}
          <Button
  type="submit"
  disabled={loading}
  className="w-full flex items-center py-5 justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
>
  {loading ? (
    <span className="flex items-center gap-2">
      <Loader2 className="animate-spin w-4 h-4" />
      {t.auth.login.loading}
    </span>
  ) : (
    t.auth.login.button
  )}
</Button>
          </form>
            </div>

          {/* 🔗 Forgot password */}
          <p
            onClick={() => router.push(`/${locale}/auth/forgot-password`)}
            className="text-sm text-center text-indigo-400 hover:underline cursor-pointer"
            >
            {t.auth.login.forgot}
          </p>

          {/* 🔁 Switch */}
          <p className="text-sm text-center text-gray-400">
            {t.auth.login.switchText}{" "}
            <span
              onClick={() => router.push(`/${locale}/auth/signup`)}
              className="text-indigo-400 cursor-pointer hover:underline"
            >
              {t.auth.login.switchAction}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}