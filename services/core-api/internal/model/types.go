package model

type Metric struct {
	Label  string `json:"label"`
	Value  string `json:"value"`
	Detail string `json:"detail"`
}

type TimelineEvent struct {
	Stage  string `json:"stage"`
	Detail string `json:"detail"`
}

type DeadManSwitch struct {
	Status           string `json:"status"`
	LastCheckIn      string `json:"lastCheckIn"`
	DaysUntilTrigger int    `json:"daysUntilTrigger"`
	TrustedContact   string `json:"trustedContact"`
}

type WillDraftSummary struct {
	HouseholdsProtected    int    `json:"householdsProtected"`
	BeneficiariesConfigured int   `json:"beneficiariesConfigured"`
	VaultStatus            string `json:"vaultStatus"`
}

type SubscriptionSummary struct {
	ActiveServices          int     `json:"activeServices"`
	MonthlySpend            float64 `json:"monthlySpend"`
	AnnualSavingsOpportunity float64 `json:"annualSavingsOpportunity"`
}

type CapsuleSummary struct {
	ScheduledDeliveries int    `json:"scheduledDeliveries"`
	EncryptedArtifacts  int    `json:"encryptedArtifacts"`
	NextReleaseWindow   string `json:"nextReleaseWindow"`
}

type DashboardSnapshot struct {
	Headline            string              `json:"headline"`
	Subheadline         string              `json:"subheadline"`
	Metrics             []Metric            `json:"metrics"`
	Timeline            []TimelineEvent     `json:"timeline"`
	DeadManSwitch       DeadManSwitch       `json:"deadManSwitch"`
	WillDraft           WillDraftSummary    `json:"willDraft"`
	SubscriptionSummary SubscriptionSummary `json:"subscriptionSummary"`
	CapsuleSummary      CapsuleSummary      `json:"capsuleSummary"`
}

type Beneficiary struct {
	Name         string `json:"name"`
	Relationship string `json:"relationship"`
	Email        string `json:"email"`
}

type DigitalWillRequest struct {
	FullName      string        `json:"fullName"`
	LegacyContact string        `json:"legacyContact"`
	Instructions  string        `json:"instructions"`
	Assets        []string      `json:"assets"`
	Beneficiaries []Beneficiary `json:"beneficiaries"`
}

type DigitalWillResponse struct {
	PlanID       string   `json:"planId"`
	Headline     string   `json:"headline"`
	Sections     []string `json:"sections"`
	Recipients   []string `json:"recipients"`
	VaultStatus  string   `json:"vaultStatus"`
	DeliveryMode string   `json:"deliveryMode"`
}

type Subscription struct {
	Name        string  `json:"name"`
	Category    string  `json:"category"`
	MonthlyCost float64 `json:"monthlyCost"`
	Status      string  `json:"status"`
	Confidence  string  `json:"confidence"`
}

type SubscriptionScanResponse struct {
	ScanID         string         `json:"scanId"`
	ReceiptsParsed int            `json:"receiptsParsed"`
	MonthlySpend   float64        `json:"monthlySpend"`
	PotentialSavings float64      `json:"potentialSavings"`
	Subscriptions  []Subscription `json:"subscriptions"`
	DeadManSwitch  struct {
		Status       string `json:"status"`
		ThresholdDays int   `json:"thresholdDays"`
		TriggerDate  string `json:"triggerDate"`
	} `json:"deadManSwitch"`
}

type Capsule struct {
	CapsuleID     string `json:"capsuleId"`
	Title         string `json:"title"`
	Recipient     string `json:"recipient"`
	DeliverOn     string `json:"deliverOn"`
	UnlockRule    string `json:"unlockRule"`
	StorageStatus string `json:"storageStatus"`
}

type CapsuleRequest struct {
	Title      string `json:"title"`
	Recipient  string `json:"recipient"`
	DeliverOn  string `json:"deliverOn"`
	UnlockRule string `json:"unlockRule"`
	Message    string `json:"message"`
}

type CapsuleResponse struct {
	CapsuleID     string   `json:"capsuleId"`
	StorageStatus string   `json:"storageStatus"`
	Manifest      []string `json:"manifest"`
	CipherPreview string   `json:"cipherPreview"`
}

