import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_LINK } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  className?: string;
  text?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isSticky?: boolean;
}

export function WhatsAppButton({
  className,
  text = "Falar com a Corretora",
  variant = "default",
  size = "lg",
  isSticky = false,
}: WhatsAppButtonProps) {
  const buttonContent = (
    <>
      <MessageCircle className={cn(isSticky ? "size-5" : "size-6")} />
      {text}
    </>
  );

  const baseStyles = "font-bold shadow-lg transition-all transform active:scale-95 gap-2";
  
  if (isSticky) {
    return (
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 md:hidden">
        <Button
          asChild
          size="lg"
          className={cn(
            "w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl h-14 text-base",
            baseStyles,
            className
          )}
        >
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            {buttonContent}
          </a>
        </Button>
      </div>
    );
  }

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn(
        "bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full py-7 px-8 text-lg",
        baseStyles,
        className
      )}
    >
      <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </a>
    </Button>
  );
}
