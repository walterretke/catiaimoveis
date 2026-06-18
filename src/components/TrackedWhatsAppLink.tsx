"use client";

import React from "react";

interface TrackedWhatsAppLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function TrackedWhatsAppLink({
  href,
  className,
  children,
}: TrackedWhatsAppLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const eventId = crypto.randomUUID();
    const currentUrl = window.location.href;
    const userAgent = navigator.userAgent;

    // Fire Meta Pixel event (client-side)
    if ((window as any).fbq) {
      (window as any).fbq("track", "Lead", {}, { eventID: eventId });
    }

    // Fire Conversions API event (server-side, no await)
    fetch("/api/meta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: eventId,
        event_url: currentUrl,
        client_user_agent: userAgent,
      }),
    }).catch(console.error);

    // Redirect programmatically after tracking fires
    window.open(href, "_blank");
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
