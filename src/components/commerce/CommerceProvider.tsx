"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useCart } from "@/store/cart";
import { useCity } from "@/store/city";
import type { City } from "@/db/queries/content";

export type CatalogEntry = {
  productId: number;
  slug: string;
  name: string;
  label: string;
  pricePKR: number;
  weightGrams: number;
  image: string | null;
  inStock: boolean;
};

type CommerceData = {
  catalog: Record<string, CatalogEntry>;
  cities: City[];
  whatsappNumber: string;
};

type CommerceContext = CommerceData & {
  /** True once the saved cart and city have been loaded from storage. */
  hydrated: boolean;
};

const Context = createContext<CommerceContext | null>(null);

export function CommerceProvider({ children, ...data }: CommerceData & { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Stores skip hydration so server and first client render match; load saved state now.
    void Promise.all([useCart.persist.rehydrate(), useCity.persist.rehydrate()]).then(() => setHydrated(true));
  }, []);

  return <Context.Provider value={{ ...data, hydrated }}>{children}</Context.Provider>;
}

export function useCommerce(): CommerceContext {
  const value = useContext(Context);
  if (!value) throw new Error("useCommerce must be used inside CommerceProvider");
  return value;
}

/** The selected city, or null until the shopper picks one. */
export function useSelectedCity(): City | null {
  const { cities } = useCommerce();
  const slug = useCity((state) => state.citySlug);
  return cities.find((city) => city.slug === slug) ?? null;
}
