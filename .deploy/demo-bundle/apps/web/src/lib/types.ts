export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

export type TimelineEvent = {
  stage: string;
  detail: string;
};

export type DashboardSnapshot = {
  headline: string;
  subheadline: string;
  metrics: DashboardMetric[];
  timeline: TimelineEvent[];
  deadManSwitch: {
    status: string;
    lastCheckIn: string;
    daysUntilTrigger: number;
    trustedContact: string;
  };
  willDraft: {
    householdsProtected: number;
    beneficiariesConfigured: number;
    vaultStatus: string;
  };
  subscriptionSummary: {
    activeServices: number;
    monthlySpend: number;
    annualSavingsOpportunity: number;
  };
  capsuleSummary: {
    scheduledDeliveries: number;
    encryptedArtifacts: number;
    nextReleaseWindow: string;
  };
};

export type BeneficiaryInput = {
  name: string;
  relationship: string;
  email: string;
};

export type DigitalWillRequest = {
  fullName: string;
  legacyContact: string;
  instructions: string;
  assets: string[];
  beneficiaries: BeneficiaryInput[];
};

export type DigitalWillResponse = {
  planId: string;
  headline: string;
  sections: string[];
  recipients: string[];
  vaultStatus: string;
  deliveryMode: string;
};

export type Subscription = {
  name: string;
  category: string;
  monthlyCost: number;
  status: string;
  confidence: string;
};

export type SubscriptionScanResponse = {
  scanId: string;
  receiptsParsed: number;
  monthlySpend: number;
  potentialSavings: number;
  subscriptions: Subscription[];
  deadManSwitch: {
    status: string;
    thresholdDays: number;
    triggerDate: string;
  };
};

export type Capsule = {
  capsuleId: string;
  title: string;
  recipient: string;
  deliverOn: string;
  unlockRule: string;
  storageStatus: string;
};

export type CapsuleRequest = {
  title: string;
  recipient: string;
  deliverOn: string;
  unlockRule: string;
  message: string;
};

export type CapsuleResponse = {
  capsuleId: string;
  storageStatus: string;
  manifest: string[];
  cipherPreview: string;
};

