// app/providers/ServiceSocketProvider.tsx
"use client";

import { useEffect } from "react";
import { servicesAPI } from "@/lib/api";
import { useServicesStore } from "@/lib/store";

export function ServiceSocketProvider() {
  const setSnapshot = useServicesStore((s) => s.setSnapshot);
  const upsertService = useServicesStore((s) => s.upsertService);

  useEffect(() => {
    let alive = true;

    async function bootstrap() {
      const snapshot = await servicesAPI.syncServiceApp();

      if (!alive) return;

      setSnapshot(snapshot.services ?? snapshot);

      servicesAPI.connect((incomingService: any) => {
        upsertService(incomingService);
      });
    }

    bootstrap();

    return () => {
      alive = false;
      servicesAPI.disconnect();
    };
  }, [setSnapshot, upsertService]);

  return null;
}
