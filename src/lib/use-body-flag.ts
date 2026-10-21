"use client";

import { useEffect } from "react";

/** Sets `data-<name>` on <body> while the calling component is mounted. */
export function useBodyFlag(name: string, active = true): void {
  useEffect(() => {
    if (!active) return;
    document.body.dataset[name] = "true";
    return () => {
      delete document.body.dataset[name];
    };
  }, [name, active]);
}
