"use client";

import { useSyncExternalStore } from "react";

export default function CurrentYear() {
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 2026
  );

  return <>{year}</>;
}