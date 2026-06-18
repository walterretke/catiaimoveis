"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StickyWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 500px (past the initial hero button)
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const eventId = crypto.randomUUID();
    const currentUrl = window.location.href;
    const userAgent = navigator.userAgent;

    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {}, { eventID: eventId });
    }

    fetch('/api/meta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_id: eventId,
        event_url: currentUrl,
        client_user_agent: userAgent
      })
    }).catch(console.error);
  };

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-500 transform md:right-10 md:bottom-10",
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-50 pointer-events-none"
      )}
    >
      <a 
        href={WHATSAPP_LINK} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-3 bg-[#25D366] text-white font-black py-4 px-6 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:bg-[#128C7E] active:scale-95 transition-all group"
      >
        <div className="relative">
           <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-20 group-hover:hidden"></span>
           <MessageCircle className="size-6 relative z-10" />
        </div>
        <span className="text-base uppercase tracking-tight">Falar com a Corretora</span>
      </a>
    </div>
  );
}
