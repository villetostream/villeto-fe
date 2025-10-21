import React from 'react'
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from '../ui/form'
import { Input } from '../ui/input'

const FormFieldInput = ({ name, label, placeholder, control, description, type = "text", inputMode }: { type?: React.HTMLInputTypeAttribute; name: string, label: string, placeholder: string, control: any, description?: string, inputMode?: "search" | "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | undefined }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input className='input' type={type} placeholder={placeholder} inputMode={inputMode} {...field} />
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
export default FormFieldInput