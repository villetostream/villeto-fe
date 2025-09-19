"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { apiPost } from "../_shared/api";
import { Form, FormLabel } from "../../ui/form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export default function Step6CardsPolicies({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const form = useForm({ defaultValues: { funds: [{ name: "Default Fund", amount: 1000, startDate: "", endDate: "" }], card_types: { virtual: true, physical: false, single_use: false } } });
    const { fields, append, remove } = useFieldArray({ control, name: "funds" });

    async function onSubmit(values: any) {
        await apiPost("/api/onboard/policies", { onboarding_id: typeof window !== "undefined" && document.cookie.includes("onboarding_id") ? document.cookie.split("onboarding_id=")[1].split(";")[0] : undefined, ...values });
        onNext();
    }

    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="text-lg font-semibold">Set your initial spend controls</h2>
                <p className="text-sm text-gray-600">Use presets to launch quickly or customize settings per fund.</p>

                <div>
                    <FormLabel>Funds / Budgets</FormLabel>
                    <div className="space-y-3">
                        {fields.map((f, idx) => (
                            <div key={f.id} className="border rounded p-3 space-y-2">
                                <Input {...form.register(`funds.${idx}.name` as const)} placeholder="Fund name" />
                                <div className="grid grid-cols-3 gap-2">
                                    <Input type="number" {...form.register(`funds.${idx}.amount` as const)} placeholder="Amount" />
                                    <input type="date" {...form.register(`funds.${idx}.startDate` as const)} className="border rounded p-2" />
                                    <input type="date" {...form.register(`funds.${idx}.endDate` as const)} className="border rounded p-2" />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="button" variant="secondary" onClick={() => remove(idx)}>Remove</Button>
                                </div>
                            </div>
                        ))}
                        <div>
                            <Button type="button" onClick={() => append({ name: "", amount: 0, startDate: "", endDate: "" })}>Add fund</Button>
                        </div>
                    </div>
                </div>

                <div>
                    <FormLabel>Card types</FormLabel>
                    <div className="flex gap-3 items-center">
                        <label className="flex items-center gap-2"><input type="checkbox" {...form.register("card_types.virtual")} defaultChecked /> Virtual</label>
                        <label className="flex items-center gap-2"><input type="checkbox" {...form.register("card_types.physical")} /> Physical</label>
                        <label className="flex items-center gap-2"><input type="checkbox" {...form.register("card_types.single_use")} /> Single-use</label>
                    </div>
                </div>

                <div>
                    <FormLabel>Default limits</FormLabel>
                    <div className="grid grid-cols-3 gap-3">
                        <Input type="number" placeholder="Per transaction" {...form.register("limits.per_transaction" as const)} />
                        <Input type="number" placeholder="Daily" {...form.register("limits.daily" as const)} />
                        <Input type="number" placeholder="Monthly" {...form.register("limits.monthly" as const)} />
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
                    <Button type="submit">Continue</Button>
                </div>
            </form>
        </Form>
    );
}
