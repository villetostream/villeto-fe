"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../_shared/api";
import { Button } from "../../ui/button";

export default function Step8ReviewSubmit({ onBack }: { onBack: () => void }) {
    const [summary, setSummary] = useState<any | null>(null);
    const [termsChecked, setTermsChecked] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const id = typeof window !== "undefined" && document.cookie.includes("onboarding_id") ? document.cookie.split("onboarding_id=")[1].split(";")[0] : undefined;
                const data = await apiGet(`/api/onboard/status/${id ?? "demo"}`);
                setSummary(data);
            } catch (e) {
                // fallback: build demo summary from localStorage or empty
                setSummary({ company: { legal_name: "Demo" }, status_tiles: { kyb: "Pending", bank: "Pending", accounting: "Not connected" } });
            }
        })();
    }, []);

    async function submitForVerification() {
        if (!termsChecked) return alert("Please accept the Terms of Service.");
        setSubmitting(true);
        try {
            await apiPost("/api/onboard/submit", { onboarding_id: typeof window !== "undefined" && document.cookie.includes("onboarding_id") ? document.cookie.split("onboarding_id=")[1].split(";")[0] : undefined });
            alert("Submitted for verification. Typical turnaround: 1–3 business days.");
            // In prod redirect to onboarding dashboard
        } catch (e) {
            alert("Failed to submit. Try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <h2 className="text-lg font-semibold">Review and submit for verification</h2>
            <p className="text-sm text-gray-600">Please confirm the details below. Once submitted we’ll run verification checks.</p>

            <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <div className="border rounded p-3">
                        <div className="font-medium">Company summary</div>
                        <div className="text-sm text-gray-600 mt-2">{summary ? JSON.stringify(summary.company, null, 2) : "Loading..."}</div>
                    </div>

                    <div className="border rounded p-3 mt-3">
                        <div className="font-medium">Uploaded documents</div>
                        <div className="text-sm text-gray-600 mt-2">Thumbnails and filenames would display here.</div>
                    </div>

                    <div className="mt-3">
                        <label className="flex items-start gap-2">
                            <input type="checkbox" checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} />
                            <div>
                                <div className="font-medium">I accept the Terms of Service</div>
                                <div className="text-xs text-gray-500">Read full Terms of Service</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div>
                    <div className="border rounded p-3">
                        <div className="font-medium">Verification tiles</div>
                        <div className="mt-2 text-sm">
                            <div>KYB: {summary?.status_tiles?.kyb ?? "N/A"}</div>
                            <div>Bank: {summary?.status_tiles?.bank ?? "N/A"}</div>
                            <div>Accounting: {summary?.status_tiles?.accounting ?? "N/A"}</div>
                        </div>
                    </div>

                    <div className="mt-3">
                        <Button onClick={submitForVerification} disabled={submitting}>{submitting ? "Submitting..." : "Submit for verification"}</Button>
                        <div className="text-xs text-gray-500 mt-2">Typical turnaround: 1–3 business days for most checks.</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
            </div>
        </div>
    );
}
