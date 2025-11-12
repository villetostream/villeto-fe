"use client"

import OnboardingTitle from '@/components/onboarding/_shared/OnboardingTitle'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ArrowRight, Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import FormFieldInput from '@/components/form fields/formFieldInput'
import CircleProgress from '@/components/HalfProgressCircle'
import { useConfirmationOnboardingApi } from '@/actions/pre-onboarding/confirm-onbarding-status'
import { Onboarding, useGetOnboardingDetailsApi } from '@/actions/pre-onboarding/get-onboarding-details'
import { useOnboardingStore } from '@/stores/useVilletoStore'
import { toast } from 'sonner'
import { emailSchema } from '@/lib/schemas/schemas'



type EmailForm = z.infer<typeof emailSchema>

const Page = () => {
  const router = useRouter()
  const form = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  const confirmAccount = useConfirmationOnboardingApi();
  const onboarding = useOnboardingStore()

  // useQuery for onboarding details - but we'll enable it only after confirmation
  const [shouldFetchDetails, setShouldFetchDetails] = React.useState(false);
  const [confirmedEmail, setConfirmedEmail] = React.useState('');


  const onboardingDetails = useGetOnboardingDetailsApi(
    shouldFetchDetails ? confirmedEmail : "",
    {
      enabled: shouldFetchDetails && !!confirmedEmail,
    }
  );

  const loading = confirmAccount.isPending || onboardingDetails.isLoading;

  React.useEffect(() => {
    if (shouldFetchDetails && onboardingDetails.isSuccess && onboardingDetails.data) {
      // Navigate based on onboarding details
      handleNavigation(onboardingDetails.data.data);
      // Reset the flag
      setShouldFetchDetails(false);
    }
  }, [onboardingDetails.isSuccess, onboardingDetails.data, shouldFetchDetails]);

  const onSubmit = async (data: EmailForm) => {
    try {
      // Step 1: Confirm account
      onboarding.setContactEmail(data.email)
      const confirmResponse = await confirmAccount.mutateAsync(data);
      console.log({ confirmResponse })

      setConfirmedEmail(confirmResponse.data.onboardingId);
      onboarding.setOnboardingId(confirmResponse.data?.onboardingId);
      setShouldFetchDetails(true);

    } catch (e: any) {
      let error = e as AxiosError
      if (error.status === 404) {
        onboarding.reset()
        onboarding.setContactEmail(data.email)
        router.push('/pre-onboarding/registration')
      }
    }
  }

  const handleNavigation = (onboardingData: Onboarding) => {

    const status = onboardingData?.step;
    const company = onboardingData.company;

    onboarding.setPreOnboarding({ contactEmail: company.contactEmail, companyName: company.companyName, contactFirstName: company.contactFirstName, contactLastName: company.contactLastName, accountType: company.accountType });
    onboarding.updateBusinessSnapshot({ contactNumber: company.contactPhone ?? "", countryOfRegistration: company?.countryOfRegistration ?? "", website: company?.websiteUrl ?? "" })
    onboarding.updateUserProfiles([
      ...(company.owners?.map((owner) => ({
        ...owner.user,
        id: owner.user.userId,
        ownershipPercentage: owner.ownershipPercentage
      })) || []),
      ...(company.controllingOfficers?.map((officer) => ({
        ...officer.user,
        id: officer.user.userId,

      })) || [])
    ])
    if (status === 1) {
      toast.info("Complete your onboarding!")
      if (company.websiteUrl) {

        router.push('/onboarding/leadership');
      }
      else {

        router.push('/onboarding/business');
      }
    }
    if (status === 2) {
      router.push('/onboarding/financial');

      toast.info("Complete your onboarding!")
    }
    if (status === 3) {
      router.push('/onboarding/products');

      toast.info("Complete your onboarding!")
    }

    if (status === 4) {
      toast.info("Onboarding Complete, Login into your account")
      onboarding.reset();
      router.push("/login");
    }

  }

  return (
    <div className="flex-col flex justify-center h-full">
      <div className='  p-10 flex w-full items-center justify-between'>
        <div>
          <img src="/images/logo.png" className='h-14 w-32 object-cover' />
        </div>
        <CircleProgress currentStep={1} />
      </div>
      <div className='p-8 pt-10 px-[4.43777%] my-auto -translate-y-[20%]'>

        <div className="mb-8">
          <img
            src={"/images/svgs/chart-rose.svg"}
            alt="Welcome celebration"
            className="size-16 mb-6"
          />
        </div>

        <div className="space-y-3.5 pr-10">
          <OnboardingTitle
            title="Get started with Villeto"
            subtitle="Fill in your details to access a live demo or apply for a Villeto account."
          />
        </div>

        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 pt-10 ">
            <FormFieldInput
              control={form.control}
              name="email"
              label="What is your Corporate Email Address?*"
              type="email"
              placeholder="Enter your corporate email address"
            />
            <Button
              type="submit"
              variant={"hero"}
              disabled={loading}
              className="text-lg font-medium min-w-[250px] w-full ml-auto"
            >
              {loading ? "Checking..." : "Next"}
              {loading ? (
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="ml-2 h-5 w-5" />
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page;