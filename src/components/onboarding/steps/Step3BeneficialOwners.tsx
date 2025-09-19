"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "../_shared/FileUpload";
import { apiPost } from "../_shared/api";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ownerSchema = z.object({
    full_name: z.string().min(2),
    dob: z.date().optional(),
    nationality: z.string().min(1),
    residence_country: z.string().min(1),
    role: z.string().min(1),
    ownership_percentage: z.number().min(0).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    id_s3_key: z.string().optional(),
});

const schema = z.object({
    owners: z.array(ownerSchema).min(1, "Add at least one beneficial owner"),
    notes: z.string().optional(),
});

export default function Step3BeneficialOwners({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const form = useForm({ resolver: zodResolver(schema), defaultValues: { owners: [{ full_name: "", dob: undefined, nationality: "", residence_country: "", role: "Owner" }] } });
    const { fields, append, remove } = useFieldArray({ control: form.control, name: "owners" });

    const owners = form.watch("owners");
    const totalOwnership = (owners || []).reduce((acc: number, o: any) => acc + (Number(o?.ownership_percentage || 0)), 0);

    async function onSubmit(values: any) {
        // Attach onboarding id if present (mock)
        await apiPost("/api/onboard/beneficials", { onboarding_id: typeof window !== "undefined" && document.cookie.includes("onboarding_id") ? document.cookie.split("onboarding_id=")[1].split(";")[0] : undefined, owners: values.owners });
        onNext();
    }

    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="text-lg font-semibold">Add your beneficial owners and authorized signatories</h2>
                <p className="text-sm text-gray-600">For regulatory compliance we collect information about people who own or control the company.</p>

                {fields.map((f, idx) => (
                    <div key={f.id} className="border rounded p-4 space-y-2">
                        <div className="flex justify-between items-start">
                            <div className="text-sm font-medium">Person {idx + 1}</div>
                            <div className="flex gap-2">
                                <Button type="button" variant="secondary" onClick={() => remove(idx)}>Remove</Button>
                            </div>
                        </div>

                        <FormField control={form.control} name={`owners.${idx}.full_name`}
                            render={({ field }) => (
                                <FormItem>

                                    <FormLabel>Full name</FormLabel>
                                    <Input {...field} placeholder="Full name" />
                                </FormItem>
                            )} />

                        <div className="grid grid-cols-3 gap-3">
                            <FormField control={form.control} name={`owners.${idx}.dob`}
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel>Date of birth</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value && field.value instanceof Date ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    captionLayout="dropdown"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>)} />

                            <FormField control={form.control} name={`owners.${idx}.nationality`}
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel>Nationality</FormLabel>
                                        <Input {...field} placeholder="Nationality" />
                                    </FormItem>)}
                            />
                            <FormField control={form.control} name={`owners.${idx}.residence_country`}
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel>Country of residence</FormLabel>
                                        <Input {...field} placeholder="Country" />
                                    </FormItem>
                                )} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <FormField control={form.control} name={`owners.${idx}.role`}
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel>Role</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Owner">Owner</SelectItem>
                                                <SelectItem value="Director">Director</SelectItem>
                                                <SelectItem value="Authorized signatory">Authorized signatory</SelectItem>

                                            </SelectContent>
                                        </Select>
                                    </FormItem>)} />
                            <FormField control={form.control} name={`owners.${idx}.ownership_percentage`}
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel>Ownership percentage</FormLabel>
                                        <Input value={field.value?.toString() || ''} type="number" placeholder="0-100" onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                                    </FormItem>)} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <FormField control={form.control} name={`owners.${idx}.email`}
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel>Email (optional)</FormLabel>
                                        <Input {...field} placeholder="email@example.com" />
                                    </FormItem>
                                )} />
                            <FormField control={form.control} name={`owners.${idx}.phone`}
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel>Phone (optional)</FormLabel>
                                        <Input {...field} placeholder="+234..." />
                                    </FormItem>)} />
                        </div>

                        <FormField control={form.control} name={`owners.${idx}.id_s3_key`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Government ID upload</FormLabel>
                                    <FileUpload label="Government ID (passport / national ID / driver's license)" helper="Required" onUploaded={(m) => form.setValue(`owners.${idx}.id_s3_key` as const, m.s3Key)} />
                                </FormItem>)} />
                    </div>
                ))}

                <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Owners total: {totalOwnership}%</div>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => append({ full_name: "", dob: undefined, nationality: "", residence_country: "", role: "Owner" })}>Add person</Button>
                    </div>
                </div>

                <FormField control={form.control} name="notes"
                    render={({ field }) => (
                        <FormItem>

                            <FormLabel>Notes (optional)</FormLabel>
                            <Textarea {...field} className="w-full border rounded p-2" />
                        </FormItem>)} />

                {form.formState.errors.owners && <div className="text-xs text-red-600">{String(form.formState.errors.owners?.message)}</div>}

                <div className="flex justify-between">
                    <Button type="button" variant="secondary" onClick={onBack}>Back</Button>
                    <Button type="submit">Continue</Button>
                </div>
            </form>
        </Form>
    );
}
