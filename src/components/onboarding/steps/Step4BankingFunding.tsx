"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPost } from "../_shared/api";

const schema = z.object({
  preferred_funding_method: z.enum(["connect", "manual"]),
  account_holder_name: z.string().optional(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  routing_number: z.string().optional(),
  billing_contact: z.string().optional(),
});

export default function Step4BankingFunding({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [connecting, setConnecting] = useState(false);
  const { register, handleSubmit, watch } = useForm({ resolver: zodResolver(schema), defaultValues: { preferred_funding_method: "connect" } });

  const method = watch("preferred_funding_method");

  async function startConnect() {
    setConnecting(true);
    try {
      // call server to get a link token (Plaid/Tink)
      const r = await apiPost("/api/onboard/bank/connect", { onboarding_id: typeof window !== "undefined" && document.cookie.includes("onboarding_id") ? document.cookie.split("onboarding_id=")[1].split(";")[0] : undefined });
      // in prod you would open the link; here we mock delay
      await new Promise((r2) => setTimeout(r2, 800));
      // on success, proceed
      onNext();
    } catch (e) {
      alert("We couldn't connect to your bank. Try again or enter details manually.");
    } finally {
      setConnecting(false);
    }
  }

  async function onSubmit(values: any) {
    await apiPost("/api/onboard/bank/manual", { ...values, onboarding_id: typeof window !== "undefined" && document.cookie.includes("onboarding_id") ? document.cookie.split("onboarding_id=")[1].split(";")[0] : undefined });
    onNext();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Connect a bank for funding and payments</h2>
      <p className="text-sm text-gray-600">Connect securely through our banking partner or enter details manually. Connecting your bank via provider is faster.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <Label>Preferred funding method</Label>
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-2"><input type="radio" value="connect" {...register("preferred_funding_method")} defaultChecked /> Connect my bank (recommended)</label>
            <label className="flex items-center gap-2"><input type="radio" value="manual" {...register("preferred_funding_method")} /> Enter bank details manually</label>
          </div>
        </div>

        {method === "connect" ? (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Recommended: faster and secure.</div>
            <div className="flex gap-2">
              <Button type="button" onClick={startConnect} disabled={connecting}>{connecting ? "Connecting..." : "Connect bank"}</Button>
              <Button type="button" variant="secondary" onClick={() => { /* fallback to manual */ }}>Enter manually</Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <Label>Account holder name</Label>
              <TextInput {...register("account_holder_name")} placeholder="Account holder name" />
            </div>
            <div>
              <Label>Bank name</Label>
              <TextInput {...register("bank_name")} placeholder="Bank name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Account number / IBAN</Label>
                <TextInput {...register("account_number")} placeholder="Account number / IBAN" />
              </div>
              <div>
                <Label>Routing / BIC / SWIFT</Label>
                <TextInput {...register("routing_number")} placeholder="Routing number / BIC / SWIFT" />
              </div>
            </div>

            <div>
              <Label>Upload voided check or bank statement (recommended)</Label>
              <FileUpload label="Voided check / Bank statement" onUploaded={(m) => { /* append to payload if desired */ }} />
            </div>
          </>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
          {method === "manual" ? <Button type="submit">Continue</Button> : <Button type="button" onClick={startConnect}>Continue</Button>}
        </div>
      </form>
    </div>
  );
}
