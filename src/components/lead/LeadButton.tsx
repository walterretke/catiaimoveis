"use client";

import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useLead } from "./LeadProvider";

interface LeadButtonProps {
  children?: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
}

export function LeadButton({ children = "Falar no WhatsApp", className, size = "lg" }: LeadButtonProps) {
  const { open } = useLead();
  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-2xl bg-wa font-semibold text-white shadow-lg shadow-wa/25 transition hover:bg-wa-dark active:scale-[0.98]",
        size === "lg" ? "h-14 px-7 text-base" : "h-12 px-5 text-[15px]",
        className,
      )}
    >
      <WhatsAppIcon className={size === "lg" ? "size-6" : "size-5"} />
      {children}
    </button>
  );
}
