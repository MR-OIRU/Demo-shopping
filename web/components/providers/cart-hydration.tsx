"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart-store";

export function CartHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}
