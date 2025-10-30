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

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
})

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
      const confirmResponse = await confirmAccount.mutateAsync(data);

      setConfirmedEmail("a0451fee-17e5-450d-a215-d14ffaaa020c");
      onboarding.setOnboardingId("a0451fee-17e5-450d-a215-d14ffaaa020c");
      setShouldFetchDetails(true);

    } catch (e: any) {
      let error = e as AxiosError
      if (error.status === 404) {
        router.push('/pre-onboarding/registration')
      }
    }
  }

  const handleNavigation = (onboardingData: Onboarding) => {

    const status = onboardingData?.step;

    if (status === 1) {
      router.push('/onboarding');
    }

  }

  return (
    <div className="flex-col flex justify-center h-full">
      <div className='absolute top-0 left-0 mb-auto p-10 flex w-full items-center justify-between'>
        <div>
          <img src="/images/logo.png" className='h-14 w-32 object-cover' />
        </div>
        <CircleProgress currentStep={1} />
      </div>
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 pt-10">
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
  )
}

export default Page;