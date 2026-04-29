"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getT } from "@/lib/getT";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

export default function ContactPageComponent() {
  const { locale } = useParams();
  const t = getT(locale as string);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
        toast(t.contact.required);
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
      );
      toast(t.contact.success);

      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast(t.contact.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-0 sm:px-4 py-10 text-white">
      {/* 🧾 Card */}
      <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold">
            {t.contact.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {t.contact.desc}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">

          <input
            placeholder={t.contact.name}
            className="w-full p-3 bg-black/60 border border-white/20 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder={t.contact.email}
            className="w-full p-3 bg-black/60 border border-white/20 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <textarea
            placeholder={t.contact.message}
            className="w-full p-3 bg-black/60 border border-white/20 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            rows={5}
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition px-4 py-3 rounded-lg font-medium"
          >
            {t.contact.send}
          </button>
        </div>

        {/* 📧 Fallback email */}
        <p className="text-xs text-gray-500 text-center">
          {t.contact.alt}{" "}
          <a
            href="mailto:support@tcgfinderjapan.com"
            className="text-indigo-400 hover:underline"
          >
            support@tcgfinderjapan.com
          </a>
        </p>
      </div>
    </div>
  );
}