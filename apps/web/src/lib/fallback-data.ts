import type {
  Capsule,
  DashboardSnapshot,
  Subscription,
  SubscriptionScanResponse,
} from "./types";

export const dashboardFallback: DashboardSnapshot = {
  headline: "A softer front door to a hard conversation.",
  subheadline:
    "Help people tidy subscriptions today, protect digital assets tomorrow, and preserve memories for the right moment.",
  metrics: [
    {
      label: "Inheritance guides staged",
      value: "148",
      detail: "DIY digital-will drafts sealed with vault protection.",
    },
    {
      label: "Subscription waste spotted",
      value: "$6,420",
      detail: "Projected annual savings from duplicate or forgotten services.",
    },
    {
      label: "Capsules on schedule",
      value: "312",
      detail: "Encrypted letters, files, and future notes awaiting release.",
    },
  ],
  timeline: [
    {
      stage: "Today",
      detail: "Scan inbox receipts, catalog cloud accounts, and name one trusted contact.",
    },
    {
      stage: "This month",
      detail: "Refine beneficiary instructions and rehearse the delivery flow with a safe PDF preview.",
    },
    {
      stage: "When triggered",
      detail: "Release instructions, unlock notes, and notify the right people without exposing raw secrets ahead of time.",
    },
  ],
  deadManSwitch: {
    status: "Armed and healthy",
    lastCheckIn: "2026-03-11",
    daysUntilTrigger: 74,
    trustedContact: "Jordan Chen",
  },
  willDraft: {
    householdsProtected: 42,
    beneficiariesConfigured: 96,
    vaultStatus: "AES-256 envelope sealed",
  },
  subscriptionSummary: {
    activeServices: 11,
    monthlySpend: 167,
    annualSavingsOpportunity: 432,
  },
  capsuleSummary: {
    scheduledDeliveries: 28,
    encryptedArtifacts: 64,
    nextReleaseWindow: "2026-09-01",
  },
};

export const subscriptionFallback: Subscription[] = [
  {
    name: "Netflix Premium",
    category: "Entertainment",
    monthlyCost: 19.99,
    status: "Keep",
    confidence: "Receipt-confirmed",
  },
  {
    name: "Spotify Family",
    category: "Music",
    monthlyCost: 16.99,
    status: "Review",
    confidence: "Duplicate household plan detected",
  },
  {
    name: "ChatGPT Plus",
    category: "AI",
    monthlyCost: 20,
    status: "Keep",
    confidence: "Active usage in last 14 days",
  },
  {
    name: "Adobe Creative Cloud",
    category: "Productivity",
    monthlyCost: 59.99,
    status: "Cancel candidate",
    confidence: "No recent invoice open events",
  },
];

export const scanFallback: SubscriptionScanResponse = {
  scanId: "scan_local_001",
  receiptsParsed: 24,
  monthlySpend: 167,
  potentialSavings: 36,
  subscriptions: subscriptionFallback,
  deadManSwitch: {
    status: "Waiting for next app check-in",
    thresholdDays: 90,
    triggerDate: "2026-05-27",
  },
};

export const capsuleFallback: Capsule[] = [
  {
    capsuleId: "capsule_001",
    title: "For my partner, open when you need steadiness",
    recipient: "Kai",
    deliverOn: "2026-08-12",
    unlockRule: "Specific date",
    storageStatus: "Encrypted and staged",
  },
  {
    capsuleId: "capsule_002",
    title: "18th birthday note",
    recipient: "Mina",
    deliverOn: "2034-01-30",
    unlockRule: "Specific date",
    storageStatus: "Encrypted and staged",
  },
];

