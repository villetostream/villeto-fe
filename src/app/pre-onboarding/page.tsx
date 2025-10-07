"use client"

import OnboardingTitle from '@/components/onboarding/_shared/OnboardingTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
})

type EmailForm = z.infer<typeof emailSchema>

const page = () => {
  const router = useRouter()
  const form = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: EmailForm) => {
    // Here you could save the email or do something with it
    console.log('Email submitted:', data.email)
    router.push('/pre-onboarding/registration')
  }

  return (
    <div className=" flex-col flex justify-center h-full">
      <div className="mb-8">
        <img
          src={"/images/svgs/chart-rose.svg"}
          alt="Welcome celebration"
          className="size-16 mb-6"
        />
      </div>

      <div className="space-y-3.5 pr-10">
        <OnboardingTitle title="Get started with Villeto"
          subtitle=" Fill in your details to access a live demo or apply for a Villeto account."
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 pt-10">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your Corporate Email Address?*</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your corporate email address"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={"hero"}
            className=" text-lg font-medium min-w-[250px] ml-auto"
          >
            Let's Begin
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default page