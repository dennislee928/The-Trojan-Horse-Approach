import {
  capsuleFallback,
  dashboardFallback,
  scanFallback,
} from "./fallback-data";
import type {
  Capsule,
  CapsuleRequest,
  CapsuleResponse,
  DashboardSnapshot,
  DigitalWillRequest,
  DigitalWillResponse,
  SubscriptionScanResponse,
} from "./types";

const coreApiUrl =
  process.env.NEXT_PUBLIC_CORE_API_URL ?? "http://localhost:8080";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${coreApiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  try {
    return await fetchJson<DashboardSnapshot>("/api/dashboard");
  } catch {
    return dashboardFallback;
  }
}

export async function createWillPlan(
  payload: DigitalWillRequest,
): Promise<DigitalWillResponse> {
  const response = await fetch(`${coreApiUrl}/api/digital-will/plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to create digital will guide.");
  }

  return (await response.json()) as DigitalWillResponse;
}

export async function runInboxScan(email: string): Promise<SubscriptionScanResponse> {
  try {
    return await fetchJson<SubscriptionScanResponse>("/api/subscriptions/scan", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  } catch {
    return scanFallback;
  }
}

export async function listCapsules(): Promise<Capsule[]> {
  try {
    return await fetchJson<Capsule[]>("/api/capsules");
  } catch {
    return capsuleFallback;
  }
}

export async function createCapsule(
  payload: CapsuleRequest,
): Promise<CapsuleResponse> {
  const response = await fetch(`${coreApiUrl}/api/capsules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to seal time capsule.");
  }

  return (await response.json()) as CapsuleResponse;
}
