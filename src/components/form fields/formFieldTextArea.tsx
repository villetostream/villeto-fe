import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form'
import { Textarea } from "@/components/ui/textarea";

const FormFieldTextArea = ({ name, label, placeholder, control, description }: { name: string, label: string, placeholder: string, control: any, description?: string }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea placeholder={placeholder} {...field} className='input' />
                    </FormControl>
                    <FormDescription>
                        {description}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormFieldTextArea