"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/store/cart";

export function CartButton() {
  const t = useTranslations("v2.nav");
  const count = useCart((state) => state.lines.reduce((sum, line) => sum + line.quantity, 0));
  const openCart = useCart((state) => state.open);

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-v2-tint"
      aria-label={`${t("cart")} (${count})`}
    >
      <Icon name="cart" size={21} />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-v2-ink px-1 text-[0.65rem] font-semibold leading-[18px] text-white">
          {count}
        </span>
      )}
    </button>
  );
}
