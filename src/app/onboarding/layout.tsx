import Link from "next/link";
import { steps } from "@/components/onboarding/stepsConfig";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // Determine current step from pathname if needed, or let each page handle
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Company Onboarding</h1>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {steps.map((s) => (
            <Link key={s.id} href={`/onboarding/step/${s.id}`} className="flex-1 text-center">
              <div
                className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center ${
                  // You can style active step based on pathname
                  "bg-gray-200 text-gray-600"
                }`}
              >
                {s.id}
              </div>
              <div className="text-xs mt-1">{s.label}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-6">{children}</div>
    </div>
  );
}
