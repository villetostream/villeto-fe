"use client";

import { useState } from "react";
import { apiPost } from "../_shared/api";
import { Button } from "../../ui/button";

export default function Step5Accounting({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [provider, setProvider] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  async function connectProvider(name: string) {
    setConnecting(true);
    try {
      const r = await apiPost("/api/onboard/integrations", { provider: name, onboarding_id: typeof window !== "undefined" && document.cookie.includes("onboarding_id") ? document.cookie.split("onboarding_id=")[1].split(";")[0] : undefined });
      // mock connect
      await new Promise((r2) => setTimeout(r2, 700));
      setProvider(name);
    } catch (e) {
      alert("Connection failed.");
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Connect your accounting system (recommended)</h2>
      <p className="text-sm text-gray-600">This enables automatic posting and faster reconciliation.</p>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {["QuickBooks Online", "Xero", "NetSuite", "Sage Intacct"].map((p) => (
          <div key={p} className="border rounded p-3">
            <div className="font-medium">{p}</div>
            <div className="text-xs text-gray-500">Connect to {p}</div>
            <div className="mt-3">
              <Button onClick={() => connectProvider(p)} disabled={connecting || provider === p}>{provider === p ? "Connected" : "Connect"}</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
        <Button type="button" onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
}
