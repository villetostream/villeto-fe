"use client";

import { useState } from "react";
import { apiPost } from "../_shared/api";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export default function Step7TeamProvisioning({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [invites, setInvites] = useState<any[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  function handleAddInvite(e: React.FormEvent) {
    e.preventDefault();
    const f = e.target as HTMLFormElement;
    const name = (f.elements.namedItem("name") as HTMLInputElement).value;
    const email = (f.elements.namedItem("email") as HTMLInputElement).value;
    const role = (f.elements.namedItem("role") as HTMLInputElement).value;
    setInvites((p) => [...p, { name, email, role }]);
    f.reset();
  }

  async function handleCsv(file?: File) {
    setCsvError(null);
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const parsed: any[] = [];
    for (const line of lines) {
      const cols = line.split(",");
      if (cols.length < 2) {
        setCsvError("CSV format invalid. Required: name,email,role (role optional).");
        return;
      }
      parsed.push({ name: cols[0].trim(), email: cols[1].trim(), role: (cols[2] || "Employee").trim() });
    }
    setInvites((p) => [...p, ...parsed]);
  }

  async function submitInvites() {
    await apiPost("/api/onboard/team", { onboarding_id: typeof window !== "undefined" && document.cookie.includes("onboarding_id") ? document.cookie.split("onboarding_id=")[1].split(";")[0] : undefined, invites });
    onNext();
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Add your team and access controls</h2>
      <p className="text-sm text-gray-600">Invite users now or connect your SSO to sync users automatically.</p>

      <form onSubmit={handleAddInvite} className="grid grid-cols-3 gap-3 mt-4">
        <Input name="name" placeholder="Full name" />
        <Input name="email" placeholder="Email" />
        <select name="role" className="border rounded p-2">
          <option>Admin</option>
          <option>Finance</option>
          <option>Approver</option>
          <option>Employee</option>
        </select>
        <div className="col-span-3 flex gap-2">
          <Button type="submit">Add invite</Button>
          <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
            <input type="file" accept=".csv" onChange={(e) => handleCsv(e.target.files?.[0])} />
            Upload CSV
          </label>
        </div>
      </form>

      <div className="mt-4">
        <div className="font-medium">Pending invites</div>
        {invites.length === 0 ? <div className="text-sm text-gray-500 mt-2">No invites yet</div> : (
          <ul className="mt-2 space-y-1">
            {invites.map((i, idx) => (
              <li key={idx} className="flex justify-between border rounded p-2">
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-gray-600">{i.email} • {i.role}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {csvError && <div className="text-xs text-red-600">{csvError}</div>}

      <div className="flex justify-between mt-6">
        <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => alert("SSO/SCIM connect flow not implemented in demo.")}>Connect SSO</Button>
          <Button onClick={submitInvites}>Continue</Button>
        </div>
      </div>
    </div>
  );
}
