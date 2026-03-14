"use client";

import { useMemo, useState, useTransition } from "react";

import { createWillPlan } from "../lib/api";
import type {
  BeneficiaryInput,
  DigitalWillRequest,
  DigitalWillResponse,
} from "../lib/types";

const assetCategories = [
  "Cloud drives",
  "Social accounts",
  "Domain names",
  "Crypto wallets",
  "Password vaults",
  "Creator revenue accounts",
];

type DigitalWillWizardProps = {
  householdsProtected: number;
  beneficiariesConfigured: number;
  vaultStatus: string;
};

export function DigitalWillWizard({
  householdsProtected,
  beneficiariesConfigured,
  vaultStatus,
}: DigitalWillWizardProps) {
  const [fullName, setFullName] = useState("Dennis Lee");
  const [legacyContact, setLegacyContact] = useState("family@example.com");
  const [instructions, setInstructions] = useState(
    "Share my password manager hint only after my inactivity threshold is exceeded and my backup contact confirms.",
  );
  const [selectedAssets, setSelectedAssets] = useState<string[]>([
    "Cloud drives",
    "Social accounts",
    "Password vaults",
  ]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryInput[]>([
    {
      name: "Jordan Chen",
      relationship: "Partner",
      email: "jordan@example.com",
    },
    {
      name: "Mina Lee",
      relationship: "Sibling",
      email: "mina@example.com",
    },
  ]);
  const [result, setResult] = useState<DigitalWillResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const readinessLabel = useMemo(() => {
    if (selectedAssets.length >= 4 && beneficiaries.length >= 2) {
      return "Strong first draft";
    }

    if (selectedAssets.length >= 2) {
      return "Foundational";
    }

    return "Just getting started";
  }, [beneficiaries.length, selectedAssets.length]);

  function toggleAsset(asset: string) {
    setSelectedAssets((current) =>
      current.includes(asset)
        ? current.filter((item) => item !== asset)
        : [...current, asset],
    );
  }

  function updateBeneficiary(
    index: number,
    field: keyof BeneficiaryInput,
    value: string,
  ) {
    setBeneficiaries((current) =>
      current.map((beneficiary, currentIndex) =>
        currentIndex === index
          ? { ...beneficiary, [field]: value }
          : beneficiary,
      ),
    );
  }

  function addBeneficiary() {
    setBeneficiaries((current) => [
      ...current,
      { name: "", relationship: "", email: "" },
    ]);
  }

  function submitPlan() {
    setError(null);
    const payload: DigitalWillRequest = {
      fullName,
      legacyContact,
      instructions,
      assets: selectedAssets,
      beneficiaries: beneficiaries.filter(
        (item) => item.name && item.relationship && item.email,
      ),
    };

    startTransition(async () => {
      try {
        const response = await createWillPlan(payload);
        setResult(response);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to generate guide preview.",
        );
      }
    });
  }

  return (
    <section
      id="digital-will"
      className="grid gap-6 rounded-[2rem] border border-[#eadfd0] bg-[#fff9f1]/80 p-6 shadow-[0_18px_50px_rgba(85,54,35,0.08)] lg:grid-cols-[1.08fr_0.92fr] lg:p-8"
    >
      <div className="space-y-6">
        <div>
          <div className="section-kicker">Product 1</div>
          <h2 className="section-title">DIY digital will, minus the legal fog.</h2>
          <p className="section-copy">
            Turn a simple interview flow into an inheritance guide with
            beneficiaries, unlock instructions, and an encrypted delivery plan.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="stat-card">
            <div className="stat-label">Households protected</div>
            <div className="stat-value">{householdsProtected}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Beneficiaries mapped</div>
            <div className="stat-value">{beneficiariesConfigured}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Vault posture</div>
            <div className="stat-value text-lg">{vaultStatus}</div>
          </article>
        </div>

        <div className="grid gap-5">
          <label className="field">
            <span>Full name</span>
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </label>

          <label className="field">
            <span>Primary legacy contact</span>
            <input
              value={legacyContact}
              onChange={(event) => setLegacyContact(event.target.value)}
            />
          </label>

          <div className="field">
            <span>What should this guide cover?</span>
            <div className="flex flex-wrap gap-3">
              {assetCategories.map((asset) => {
                const isActive = selectedAssets.includes(asset);

                return (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => toggleAsset(asset)}
                    className={
                      isActive
                        ? "chip chip-active"
                        : "chip"
                    }
                  >
                    {asset}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field">
            <span>Beneficiaries</span>
            <div className="grid gap-3">
              {beneficiaries.map((beneficiary, index) => (
                <div
                  key={`${beneficiary.email}-${index}`}
                  className="grid gap-3 rounded-[1.2rem] border border-[#e5d7c5] bg-white/85 p-4 sm:grid-cols-3"
                >
                  <input
                    value={beneficiary.name}
                    onChange={(event) =>
                      updateBeneficiary(index, "name", event.target.value)
                    }
                    placeholder="Name"
                  />
                  <input
                    value={beneficiary.relationship}
                    onChange={(event) =>
                      updateBeneficiary(index, "relationship", event.target.value)
                    }
                    placeholder="Relationship"
                  />
                  <input
                    value={beneficiary.email}
                    onChange={(event) =>
                      updateBeneficiary(index, "email", event.target.value)
                    }
                    placeholder="Email"
                  />
                </div>
              ))}
            </div>
            <button type="button" className="ghost-button mt-3" onClick={addBeneficiary}>
              Add another person
            </button>
          </div>

          <label className="field">
            <span>Unlock instructions</span>
            <textarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              rows={4}
            />
          </label>
        </div>
      </div>

      <aside className="flex flex-col justify-between rounded-[1.7rem] bg-[#203732] p-6 text-[#eef5f2]">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-[#bccfca]">
            Current readiness
          </div>
          <div className="mt-3 font-display text-4xl text-white">
            {readinessLabel}
          </div>
          <p className="mt-4 text-sm leading-7 text-[#d5e0dc]">
            The MVP generates an inheritance guide preview and seals the record
            so the delivery workflow can distribute a PDF later.
          </p>
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-white/8 p-5">
          <div className="text-xs uppercase tracking-[0.28em] text-[#bccfca]">
            What gets shipped
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[#eef5f2]">
            <li>Encrypted digital asset checklist</li>
            <li>Named recipients and relationship map</li>
            <li>Delivery mode for the future PDF handoff</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={submitPlan}
          className="primary-button mt-8"
          disabled={isPending}
        >
          {isPending ? "Generating guide..." : "Generate inheritance guide"}
        </button>

        {error ? <p className="mt-4 text-sm text-[#ffcfbf]">{error}</p> : null}

        {result ? (
          <div className="mt-6 rounded-[1.5rem] bg-[#f6fbf8] p-5 text-[#23322d]">
            <div className="text-xs uppercase tracking-[0.28em] text-[#5f7b72]">
              Preview ready
            </div>
            <div className="mt-3 text-2xl font-semibold">{result.headline}</div>
            <ul className="mt-4 space-y-2 text-sm leading-6">
              {result.sections.map((section) => (
                <li key={section}>{section}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6">
              Delivery mode: <span className="font-semibold">{result.deliveryMode}</span>
            </p>
            <p className="text-sm leading-6">
              Recipients: {result.recipients.join(", ")}
            </p>
            <p className="text-sm leading-6">
              Vault status: <span className="font-semibold">{result.vaultStatus}</span>
            </p>
          </div>
        ) : null}
      </aside>
    </section>
  );
}

