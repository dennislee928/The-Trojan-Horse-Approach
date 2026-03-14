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

const publicCoreApiUrl = process.env.NEXT_PUBLIC_CORE_API_URL?.trim();
const internalCoreApiUrl =
  process.env.CORE_API_URL?.trim() ||
  publicCoreApiUrl ||
  "http://localhost:8080";

function resolveServerApiUrl(path: string): string {
  return `${internalCoreApiUrl}${path}`;
}

function resolveBrowserApiUrl(path: string): string {
  if (!publicCoreApiUrl || publicCoreApiUrl === "same-origin") {
    return path;
  }

  return `${publicCoreApiUrl}${path}`;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(resolveServerApiUrl(path), {
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
  const response = await fetch(resolveBrowserApiUrl("/api/digital-will/plans"), {
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
    const response = await fetch(resolveBrowserApiUrl("/api/subscriptions/scan"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Unable to scan inbox receipts.");
    }

    return (await response.json()) as SubscriptionScanResponse;
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
  const response = await fetch(resolveBrowserApiUrl("/api/capsules"), {
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
