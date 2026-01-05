"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Upload, X } from "lucide-react";
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
import { useEffect, useRef, useState } from "react";
import { onboardingBusinessSchema } from "@/lib/schemas/schemas";
import Image from "next/image";

// Extended schema to include logo file
const onboardingBusinessSchemaWithLogo = onboardingBusinessSchema.extend({
  businessLogo: z.any().optional().nullable(),
});

export default function Business() {
  const router = useRouter();
  const { businessSnapshot, updateBusinessSnapshot, preOnboarding } =
    useOnboardingStore();
  const updateOnboarding = useUpdateOnboardingCompanyDetailsApi();
  const loading = updateOnboarding.isPending;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    businessSnapshot.logo || null
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm({
    resolver: zodResolver(onboardingBusinessSchemaWithLogo),
    mode: "onChange",
    defaultValues: {
      business_name:
        preOnboarding?.companyName || businessSnapshot.businessName || "",
      contactPhone: businessSnapshot.contactNumber || "",
      countryOfRegistration: businessSnapshot.countryOfRegistration || "",
      websiteUrl: businessSnapshot.website || "",
      businessLogo: null,
    },
  });

  useEffect(() => {
    if (preOnboarding || businessSnapshot) {
      form.reset({
        business_name:
          preOnboarding?.companyName || businessSnapshot.businessName || "",
        contactPhone: businessSnapshot.contactNumber || "",
        countryOfRegistration: businessSnapshot.countryOfRegistration || "",
        websiteUrl: businessSnapshot.website || "",
        businessLogo: null,
      });
      if (businessSnapshot.logo) {
        setLogoPreview(businessSnapshot.logo);
      }
    }
  }, [preOnboarding, businessSnapshot, form]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setLogoFile(file);
    form.setValue("businessLogo", file, { shouldValidate: true });

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    form.setValue("businessLogo", null, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(
    data: z.infer<typeof onboardingBusinessSchemaWithLogo>
  ) {
    try {
      // Check if we have a file to upload
      const hasFile = data.businessLogo instanceof File;

      if (hasFile) {
        // If we have a file, we MUST use FormData
        const formData = new FormData();
        formData.append("business_name", data.business_name || "");
        formData.append("contactPhone", data.contactPhone);
        formData.append("countryOfRegistration", data.countryOfRegistration);
        formData.append("websiteUrl", data.websiteUrl || "");
        formData.append("businessLogo", data.businessLogo);

        // When using FormData with Axios, we should let Axios set the Content-Type
        // but we need to make sure the mutation function accepts FormData
        await updateOnboarding.mutateAsync(formData as any);
      } else {
        // If no file, send as regular JSON to avoid potential multipart issues if the API prefers JSON
        const jsonData = {
          business_name: data.business_name,
          contactPhone: data.contactPhone,
          countryOfRegistration: data.countryOfRegistration,
          websiteUrl: data.websiteUrl,
        };
        await updateOnboarding.mutateAsync(jsonData as any);
      }

      updateBusinessSnapshot({
        businessName: data.business_name,
        contactNumber: data.contactPhone,
        countryOfRegistration: data.countryOfRegistration,
        website: data.websiteUrl,
        logo: logoPreview || undefined,
      });

      router.push("/onboarding/leadership");
    } catch (e: any) {
      console.error("Submission error:", e);
      const errorMessage =
        e.response?.data?.message || e.message || "An error occurred";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="space-y-8 flex flex-col justify-center h-full">
      <div className="text-left">
        <div className="w-16 h-16 bg-primary-light rounded-full flex mb-10">
          <HugeiconsIcon
            icon={Building03FreeIcons}
            className="size-16 text-primary"
          />
        </div>

        <OnboardingTitle
          title="Tell us more about your Business"
          subtitle="Tell us about your business"
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

          <FormField
            control={form.control}
            name="businessLogo"
            render={() => (
              <FormItem>
                <FormLabel>Business Logo</FormLabel>
                <FormControl>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 hover:border-primary hover:bg-gray-50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {logoPreview ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32">
                          <Image
                            src={logoPreview}
                            alt="Logo preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            Change Logo
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLogo();
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Drag and drop your logo here
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            or click to select a file
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
            placeholder="Enter website link"
            type="text"
            description="start with 'https://'"
          />

          <div className="w-full flex mt-10">
            <Button
              type="submit"
              className="!ml-auto min-w-[250px] max-w-[250px] self-end"
              disabled={loading}
            >
              {loading ? "Creating..." : "Continue"}
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
