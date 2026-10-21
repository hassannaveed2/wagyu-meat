"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { WhatsAppGlyph } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Floating WhatsApp button. It slides away while the shopper scrolls down so it never sits on
 * top of buttons, and returns when they scroll up. Pages adjust it through body data attributes
 * (see useBodyFlag): `data-buybar` lifts it above the mobile buy bar, `data-checkout` hides it.
 */
export function WhatsAppFloat() {
  const t = useTranslations("common");
  const { whatsappNumber } = useCommerce();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      setHidden(y > lastY && y > 240);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!whatsappNumber) return null;

  return (
    <a
      href={whatsappLink(whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("chatOnWhatsApp")}
      className={cn(
        "wa-float fixed bottom-5 right-4 z-30 grid h-13 w-13 place-items-center rounded-full bg-whatsapp text-white shadow-[var(--shadow-pop)] transition-[transform,opacity,bottom] duration-300 hover:scale-105 sm:bottom-6 sm:right-6",
        hidden && "pointer-events-none translate-y-24 opacity-0",
      )}
    >
      <WhatsAppGlyph size={26} />
    </a>
  );
}
