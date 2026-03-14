package store

import (
	"fmt"
	"slices"
	"sync"
	"time"

	"github.com/google/uuid"

	"github.com/dennislee928/the-trojan-horse-approach/services/core-api/internal/model"
)

type VaultResult struct {
	Status        string
	CipherPreview string
}

type Store struct {
	mu            sync.RWMutex
	dashboard     model.DashboardSnapshot
	subscriptions []model.Subscription
	capsules      []model.Capsule
}

func New() *Store {
	return &Store{
		dashboard: model.DashboardSnapshot{
			Headline:    "A softer front door to a hard conversation.",
			Subheadline: "Help people tidy subscriptions today, protect digital assets tomorrow, and preserve memories for the right moment.",
			Metrics: []model.Metric{
				{
					Label:  "Inheritance guides staged",
					Value:  "148",
					Detail: "DIY digital-will drafts sealed with vault protection.",
				},
				{
					Label:  "Subscription waste spotted",
					Value:  "$6,420",
					Detail: "Projected annual savings from duplicate or forgotten services.",
				},
				{
					Label:  "Capsules on schedule",
					Value:  "312",
					Detail: "Encrypted letters, files, and future notes awaiting release.",
				},
			},
			Timeline: []model.TimelineEvent{
				{
					Stage:  "Today",
					Detail: "Scan inbox receipts, catalog cloud accounts, and name one trusted contact.",
				},
				{
					Stage:  "This month",
					Detail: "Refine beneficiary instructions and rehearse the delivery flow with a safe PDF preview.",
				},
				{
					Stage:  "When triggered",
					Detail: "Release instructions, unlock notes, and notify the right people without exposing raw secrets ahead of time.",
				},
			},
			DeadManSwitch: model.DeadManSwitch{
				Status:           "Armed and healthy",
				LastCheckIn:      "2026-03-11",
				DaysUntilTrigger: 74,
				TrustedContact:   "Jordan Chen",
			},
			WillDraft: model.WillDraftSummary{
				HouseholdsProtected:     42,
				BeneficiariesConfigured: 96,
				VaultStatus:             "AES-256 envelope sealed",
			},
			SubscriptionSummary: model.SubscriptionSummary{
				ActiveServices:           11,
				MonthlySpend:             167,
				AnnualSavingsOpportunity: 432,
			},
			CapsuleSummary: model.CapsuleSummary{
				ScheduledDeliveries: 28,
				EncryptedArtifacts:  64,
				NextReleaseWindow:   "2026-09-01",
			},
		},
		subscriptions: []model.Subscription{
			{
				Name:        "Netflix Premium",
				Category:    "Entertainment",
				MonthlyCost: 19.99,
				Status:      "Keep",
				Confidence:  "Receipt-confirmed",
			},
			{
				Name:        "Spotify Family",
				Category:    "Music",
				MonthlyCost: 16.99,
				Status:      "Review",
				Confidence:  "Duplicate household plan detected",
			},
			{
				Name:        "ChatGPT Plus",
				Category:    "AI",
				MonthlyCost: 20,
				Status:      "Keep",
				Confidence:  "Active usage in last 14 days",
			},
			{
				Name:        "Adobe Creative Cloud",
				Category:    "Productivity",
				MonthlyCost: 59.99,
				Status:      "Cancel candidate",
				Confidence:  "No recent invoice open events",
			},
		},
		capsules: []model.Capsule{
			{
				CapsuleID:     "capsule_001",
				Title:         "For my partner, open when you need steadiness",
				Recipient:     "Kai",
				DeliverOn:     "2026-08-12",
				UnlockRule:    "Specific date",
				StorageStatus: "Encrypted and staged",
			},
			{
				CapsuleID:     "capsule_002",
				Title:         "18th birthday note",
				Recipient:     "Mina",
				DeliverOn:     "2034-01-30",
				UnlockRule:    "Specific date",
				StorageStatus: "Encrypted and staged",
			},
		},
	}
}

func (s *Store) Dashboard() model.DashboardSnapshot {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return s.dashboard
}

func (s *Store) CheckInNow() model.DeadManSwitch {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.dashboard.DeadManSwitch.LastCheckIn = time.Now().Format("2006-01-02")
	s.dashboard.DeadManSwitch.DaysUntilTrigger = 90
	s.dashboard.DeadManSwitch.Status = "Freshly checked in"

	return s.dashboard.DeadManSwitch
}

func (s *Store) BuildWillPlan(input model.DigitalWillRequest, vault VaultResult) model.DigitalWillResponse {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.dashboard.WillDraft.HouseholdsProtected++
	s.dashboard.WillDraft.BeneficiariesConfigured += len(input.Beneficiaries)
	s.dashboard.WillDraft.VaultStatus = vault.Status

	recipients := []string{input.LegacyContact}
	for _, beneficiary := range input.Beneficiaries {
		if beneficiary.Email != "" && !slices.Contains(recipients, beneficiary.Email) {
			recipients = append(recipients, beneficiary.Email)
		}
	}

	return model.DigitalWillResponse{
		PlanID:   fmt.Sprintf("will_%s", uuid.NewString()[:8]),
		Headline: fmt.Sprintf("%s digital inheritance guide", input.FullName),
		Sections: []string{
			fmt.Sprintf("%d digital asset categories inventoried", len(input.Assets)),
			fmt.Sprintf("%d beneficiaries assigned", len(input.Beneficiaries)),
			"Unlock instructions captured for PDF delivery",
		},
		Recipients:   recipients,
		VaultStatus:  vault.Status,
		DeliveryMode: "Encrypted PDF handoff to trusted contacts",
	}
}

func (s *Store) RunSubscriptionScan() model.SubscriptionScanResponse {
	s.mu.Lock()
	defer s.mu.Unlock()

	response := model.SubscriptionScanResponse{
		ScanID:           fmt.Sprintf("scan_%s", uuid.NewString()[:8]),
		ReceiptsParsed:   24,
		MonthlySpend:     167,
		PotentialSavings: 36,
		Subscriptions:    append([]model.Subscription(nil), s.subscriptions...),
	}
	response.DeadManSwitch.Status = "Waiting for next app check-in"
	response.DeadManSwitch.ThresholdDays = 90
	response.DeadManSwitch.TriggerDate = time.Now().Add(90 * 24 * time.Hour).Format("2006-01-02")

	s.dashboard.SubscriptionSummary.ActiveServices = len(s.subscriptions)
	s.dashboard.SubscriptionSummary.MonthlySpend = response.MonthlySpend
	s.dashboard.SubscriptionSummary.AnnualSavingsOpportunity = response.PotentialSavings * 12
	s.dashboard.DeadManSwitch.Status = response.DeadManSwitch.Status
	s.dashboard.DeadManSwitch.DaysUntilTrigger = response.DeadManSwitch.ThresholdDays

	return response
}

func (s *Store) Capsules() []model.Capsule {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return append([]model.Capsule(nil), s.capsules...)
}

func (s *Store) CreateCapsule(input model.CapsuleRequest, vault VaultResult) model.CapsuleResponse {
	s.mu.Lock()
	defer s.mu.Unlock()

	capsuleID := fmt.Sprintf("capsule_%s", uuid.NewString()[:8])
	s.capsules = append([]model.Capsule{
		{
			CapsuleID:     capsuleID,
			Title:         input.Title,
			Recipient:     input.Recipient,
			DeliverOn:     input.DeliverOn,
			UnlockRule:    input.UnlockRule,
			StorageStatus: vault.Status,
		},
	}, s.capsules...)

	s.dashboard.CapsuleSummary.ScheduledDeliveries++
	s.dashboard.CapsuleSummary.EncryptedArtifacts++
	s.dashboard.CapsuleSummary.NextReleaseWindow = input.DeliverOn

	return model.CapsuleResponse{
		CapsuleID:     capsuleID,
		StorageStatus: vault.Status,
		Manifest: []string{
			fmt.Sprintf("Recipient: %s", input.Recipient),
			fmt.Sprintf("Unlock rule: %s", input.UnlockRule),
			fmt.Sprintf("Delivery date: %s", input.DeliverOn),
		},
		CipherPreview: vault.CipherPreview,
	}
}
