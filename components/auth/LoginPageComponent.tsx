"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getT } from "@/lib/getT";

export default function LoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale } = useParams();
  const t = getT(locale as string);

  const handleLogin = async () => {
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
    router.push("/map");
  };

  return (
    <div className="min-h-screen shop-bg flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md p-6 shadow-sm">
        <CardContent className="p-0 flex flex-col gap-5">
          {/* Back Button */}
          <button
            onClick={() => router.push('/map')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black"
          >
            <ArrowLeft size={16} />
            {t.auth.common.back}
          </button>

          {/* Title */}
          <div>
            <h1 className="text-xl font-semibold">{t.auth.login.title}</h1>
            <p className="text-sm text-gray-500">
              {t.auth.login.subtitle}
            </p>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-3">
            <Input
              placeholder={t.auth.common.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password with toggle */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t.auth.common.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? t.auth.login.loading : t.auth.login.button}
          </Button>

          {/* Switch */}
          <p className="text-sm text-center text-gray-500">
            {t.auth.login.switchText}{" "}
            <span
              onClick={() => router.push("/auth/signup")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              {t.auth.login.switchAction}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}