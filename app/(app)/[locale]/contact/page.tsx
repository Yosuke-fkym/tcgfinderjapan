import ContactPageComponent from '@/components/contact/ContactPageComponent';
import React from 'react'
import shopBg from  "@/assets/japan-bg-poster.png"

export default async function ContactPage() {
  
  return (
     <div className="relative min-h-screen flex flex-col">
      {/* 🌆 Background Image */}
   <div
  className="absolute inset-0 bg-center bg-cover bg-no-repeat"
 style={{ backgroundImage: `url(${shopBg.src})` }}
/>

      {/* 🌑 Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

        {/* 📦 Main Content */}
        <main className="relative z-10 flex-1">
            <div className="max-w-5xl mx-auto px-4 py-6">

<ContactPageComponent/>

            </div>
        </main>
</div>
)
}
