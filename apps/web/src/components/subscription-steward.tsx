"use client";

import { useState, useTransition } from "react";

import { runInboxScan } from "../lib/api";
import type { DashboardSnapshot, Subscription, SubscriptionScanResponse } from "../lib/types";

type SubscriptionStewardProps = {
  summary: DashboardSnapshot["subscriptionSummary"];
  initialScan: SubscriptionScanResponse;
};

function Currency({ amount }: { amount: number }) {
  return <>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)}</>;
}

export function SubscriptionSteward({
  summary,
  initialScan,
}: SubscriptionStewardProps) {
  const [email, setEmail] = useState("hello@trojanhorse.app");
  const [scan, setScan] = useState<SubscriptionScanResponse>(initialScan);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleScan() {
    setError(null);
    startTransition(async () => {
      try {
        const response = await runInboxScan(email);
        setScan(response);
      } catch (scanError) {
        setError(
          scanError instanceof Error
            ? scanError.message
            : "Unable to scan inbox receipts.",
        );
      }
    });
  }

  return (
    <section
      id="subscriptions"
      className="grid gap-6 rounded-[2rem] border border-[#dbe7e2] bg-[#f4fbf8]/90 p-6 shadow-[0_18px_50px_rgba(35,74,61,0.09)] lg:grid-cols-[0.94fr_1.06fr] lg:p-8"
    >
      <aside className="rounded-[1.7rem] bg-[#1b4c44] p-6 text-[#eef6f4]">
        <div className="section-kicker text-[#bdd7d0]">Product 2</div>
        <h2 className="section-title text-white">
          Save money while quietly setting up the safety net.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#d6e4e0]">
          The product earns trust by finding receipt-confirmed subscriptions,
          duplicate plans, and cancellation candidates. Once the user sees the
          savings, it offers the legacy setup as an obvious next step.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <article className="rounded-[1.4rem] bg-white/8 p-4">
            <div className="stat-label text-[#bdd7d0]">Active services</div>
            <div className="stat-value text-white">{summary.activeServices}</div>
          </article>
          <article className="rounded-[1.4rem] bg-white/8 p-4">
            <div className="stat-label text-[#bdd7d0]">Monthly spend</div>
            <div className="stat-value text-white">
              <Currency amount={summary.monthlySpend} />
            </div>
          </article>
          <article className="rounded-[1.4rem] bg-white/8 p-4">
            <div className="stat-label text-[#bdd7d0]">Annual savings</div>
            <div className="stat-value text-white">
              <Currency amount={summary.annualSavingsOpportunity} />
            </div>
          </article>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/7 p-5 text-sm leading-7 text-[#d6e4e0]">
          Trigger condition in this MVP: if the user goes 90 days without opening
          or checking in, the delivery workflow starts preparing their guide and
          capsule manifest for the trusted contact.
        </div>
      </aside>

      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-[1.2fr_auto] sm:items-end">
          <label className="field">
            <span>Inbox to scan</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <button
            type="button"
            onClick={handleScan}
            className="primary-button bg-[#1b4c44] text-white hover:bg-[#123a34]"
            disabled={isPending}
          >
            {isPending ? "Scanning..." : "Run mock receipt scan"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="stat-card">
            <div className="stat-label">Receipts parsed</div>
            <div className="stat-value">{scan.receiptsParsed}</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Potential savings</div>
            <div className="stat-value">
              <Currency amount={scan.potentialSavings} />
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-label">Trigger date</div>
            <div className="stat-value text-lg">{scan.deadManSwitch.triggerDate}</div>
          </article>
        </div>

        <div className="rounded-[1.5rem] border border-[#dce8e4] bg-white/90">
          <div className="flex items-center justify-between border-b border-[#e6efec] px-5 py-4">
            <div>
              <div className="text-sm font-semibold text-[#24463d]">
                Subscription ledger
              </div>
              <div className="text-xs uppercase tracking-[0.24em] text-[#7d9f95]">
                Receipt-driven recommendations
              </div>
            </div>
            <div className="rounded-full bg-[#e7f3ef] px-3 py-1 text-xs font-semibold text-[#215244]">
              {scan.deadManSwitch.status}
            </div>
          </div>

          <div className="divide-y divide-[#edf3f0]">
            {scan.subscriptions.map((subscription: Subscription) => (
              <article
                key={`${subscription.name}-${subscription.category}`}
                className="grid gap-2 px-5 py-4 sm:grid-cols-[1.3fr_0.8fr_0.6fr]"
              >
                <div>
                  <div className="font-medium text-[#203530]">{subscription.name}</div>
                  <div className="text-sm text-[#63766e]">
                    {subscription.category} · {subscription.confidence}
                  </div>
                </div>
                <div className="text-sm text-[#203530]">
                  <Currency amount={subscription.monthlyCost} /> / month
                </div>
                <div className="justify-self-start rounded-full bg-[#f3f7f5] px-3 py-1 text-xs font-semibold text-[#335a4f]">
                  {subscription.status}
                </div>
              </article>
            ))}
          </div>
        </div>

        {error ? <p className="text-sm text-[#a84f35]">{error}</p> : null}
      </div>
    </section>
  );
}

