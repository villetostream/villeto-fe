"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import OnboardingTitle from "@/components/onboarding/_shared/OnboardingTitle";
import { useOnboardingStore } from "@/stores/useVilletoStore";
import { Building03FreeIcons } from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { useUpdateOnboardingCompanyDetailsApi } from "@/actions/onboarding/update-onboarding-company-details.ts";
import FormFieldSelect from "@/components/form fields/formFieldSelect";
import FormFieldInput from "@/components/form fields/formFieldInput";
import FormFieldLogoUpload from "@/components/form fields/formFieldLogoUpload";
import { useEffect } from "react";
import { onboardingBusinessSchema } from "@/lib/schemas/schemas";

export default function Business() {
  const router = useRouter();
  const { businessSnapshot, updateBusinessSnapshot, preOnboarding } =
    useOnboardingStore();
  const updateOnboarding = useUpdateOnboardingCompanyDetailsApi();
  const loading = updateOnboarding.isPending;
  console.log({ businessSnapshot }, { preOnboarding });

  const form = useForm({
    resolver: zodResolver(onboardingBusinessSchema),
    mode: "onChange",
    defaultValues: {
      business_name: preOnboarding?.companyName || "hello",
      contactPhone: businessSnapshot.contactNumber || "",
      countryOfRegistration: businessSnapshot.countryOfRegistration || "",
      websiteUrl: businessSnapshot.website || "",
      businessLogo: businessSnapshot.logo || undefined,
    },
  });

  useEffect(() => {
    if (preOnboarding) {
      form.reset({
        business_name: preOnboarding?.companyName || "",
        contactPhone: businessSnapshot.contactNumber || "",
        countryOfRegistration: businessSnapshot.countryOfRegistration || "",
        websiteUrl: businessSnapshot.website || "",
        businessLogo: businessSnapshot.logo || undefined,
      });
    }
  }, [preOnboarding, businessSnapshot, form]);

  async function onSubmit(data: z.infer<typeof onboardingBusinessSchema>) {
    try {
      const response = await updateOnboarding.mutateAsync(data);

      // Convert logo file to base64 for local storage if it's a File
      // The API action handles conversion for API submission
      let logoUrl: string | undefined = undefined;
      if (data.businessLogo instanceof File) {
        logoUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(data.businessLogo as File);
        });
      } else if (typeof data.businessLogo === "string") {
        logoUrl = data.businessLogo;
      } else if (response?.data?.logo) {
        // Use logo from API response if available
        logoUrl = response.data.logo as string;
      }

      // Update the store with form data
      updateBusinessSnapshot({
        businessName: data.business_name,
        contactNumber: data.contactPhone,
        countryOfRegistration: data.countryOfRegistration,
        website: data.websiteUrl,
        logo: logoUrl, // Save logo to businessSnapshot
      });

      router.push("/onboarding/leadership");
    } catch (e: unknown) {
      console.warn(e);
      const error = e as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Failed to update company details"
      );
    }
  }

  return (
    <div className="space-y-8 flex flex-col  justify-center h-full">
      <div className="text-left ">
        <div className="w-16 h-16 bg-primary-light rounded-full flex mb-10">
          <HugeiconsIcon
            icon={Building03FreeIcons}
            className="size-16 text-primary"
          />
        </div>

        <OnboardingTitle
          title="Tell us more about your Business"
          subtitle="
                    Tell us about your business"
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    disabled
                    {...field}
                    placeholder="Enter your business name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormFieldLogoUpload
            control={form.control}
            name="businessLogo"
            label="Business Logo"
            description="Upload your business logo (optional)"
            maxSize={1 * 1024 * 1024}
          />

          <FormFieldSelect
            control={form.control}
            name="countryOfRegistration"
            label="Country of Registration"
            values={[
              { label: "Kenya", value: "KYA" },
              { label: "Ghana", value: "GHN" },
              { label: "Nigeria", value: "NGA" },
            ]}
            placeholder="Select Country"
          />

          <FormFieldInput
            control={form.control}
            name="contactPhone"
            label="Contact Number"
            placeholder="Enter contact number"
          />

          <FormFieldInput
            control={form.control}
            name="websiteUrl"
            label="Website"
            placeholder="Enter website link "
            type="text"
            description="start with 'https://'"
          />

          {/* <FormField control={form.control} name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>

                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                <div className="grid grid-cols-2 gap-3">

                    <FormField control={form.control} name="currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                    </FormControl>           <SelectContent>

                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="NGN">NGN</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                </div> */}

          <div className="w-full flex mt-10">
            <Button
              type="submit"
              className="ml-auto! min-w-[250px] max-w-[250px] self-end"
              disabled={loading}
            >
              {loading ? "Creating..." : "Continue"}{" "}
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
