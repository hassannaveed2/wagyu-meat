"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useCommerce } from "@/components/commerce/CommerceProvider";
import { ButtonLink } from "@/components/ui/Button";
import { useCart } from "@/store/cart";

/** The cart lives in the drawer; this page opens it and offers a checkout link for direct visits. */
export function CartPageView() {
  const t = useTranslations("cart");
  const { hydrated } = useCommerce();
  const open = useCart((state) => state.open);
  const count = useCart((state) => state.lines.length);

  useEffect(() => {
    if (hydrated && count > 0) open();
  }, [hydrated, count, open]);

  if (!hydrated) return null;
  return count > 0 ? (
    <ButtonLink href="/checkout" size="lg">
      {t("checkout")}
    </ButtonLink>
  ) : (
    <div>
      <p className="text-ink-2">{t("empty")}</p>
      <ButtonLink href="/shop" className="mt-5">
        {t("emptyCta")}
      </ButtonLink>
    </div>
  );
}
