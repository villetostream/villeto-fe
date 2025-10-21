"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { CalendarIcon, PlusIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { ExpenseForm } from './ExpenseForm'
import useModal from '@/hooks/useModal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormFieldInput from '../form fields/formFieldInput'
import { Form } from '../ui/form'
import FormFieldCalendar from '../form fields/FormFieldCalendar'

// Zod schema for form validation
const reportSchema = z.object({
    reportName: z.string().min(1, "Report name is required").max(100, "Report name is too long"),
    reportDate: z.date().refine((val) => !!val, {
        message: "Report date is required",
    }),
})

type ReportFormData = z.infer<typeof reportSchema>

const AddNewReport = ({ isOpen, close, toggle }: { isOpen: boolean, close: any, toggle: any }) => {

    const { isOpen: isFormOpen, open: openForm, close: toggleForm } = useModal()

    // Initialize react-hook-form with zod resolver
    const formHook = useForm<ReportFormData>({
        resolver: zodResolver(reportSchema),
        mode: "onChange",
        defaultValues: {
            reportName: "",
            reportDate: new Date()
        }
    })
    const {
        handleSubmit,
        formState: { isSubmitting, isValid },
        reset,
        control,
    } = formHook;

    const { reportName, reportDate } = formHook.getValues();

    const onSubmit = (data: ReportFormData) => {
        console.log("Form submitted:", data)
        close()
        openForm()
        // You can add API call here if needed
    }

    const defaultTrigger = (
        <Button variant={"ghost"} className='hover:bg-primary/5'>
            <PlusIcon className="w-4 h-4 mr-2" />
            Start New Report
        </Button>
    );
    console.log("in the add new report")

    if (isFormOpen) {
        return (

            <ExpenseForm open={openForm} isOpen={isFormOpen} toggle={toggleForm} reportName={reportName} reportDate={reportDate.toDateString()} />
        )
    }
    return (
        <>

            <Sheet open={isOpen} onOpenChange={toggle}>

                <SheetContent side="right" className="w-full overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-semibold text-dashboard-text-primary">
                            Add New Report
                        </SheetTitle>
                        <SheetDescription className="text-dashboard-text-secondary">
                            Kindly enter the following information to continue
                        </SheetDescription>
                    </SheetHeader>
                    <Form {...formHook}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-5">
                            <div className="grid gap-6">

                                <FormFieldInput label='Report Name' name="reportName" placeholder="Enter report name" control={control} />
                                <FormFieldCalendar
                                    control={control}
                                    label='Report Date' name="reportDate"
                                />

                            </div>

                            <Button
                                size={"md"}
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="w-fit min-w-40"
                            >
                                {isSubmitting ? "Processing..." : "Proceed"}
                            </Button>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default AddNewReport