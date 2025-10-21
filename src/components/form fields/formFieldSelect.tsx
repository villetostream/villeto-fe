import React from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Path, UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FormFieldSelectProps<T extends Record<string, any>> {
    placeholder: string;
    control: any;
    name: Path<T>;
    label: string;
    description?: string;
    values: Array<{ label: string; value: string | number | boolean }>;
}

const FormFieldSelect = <T extends Record<string, any>>({
    control,
    name,
    label,
    description,
    values,
    placeholder
}: FormFieldSelectProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Select

                            onValueChange={field.onChange}
                            value={field.value?.toString()} // Convert to string for consistent comparison
                            defaultValue={field.value?.toString()}
                        >
                            <SelectTrigger className="input capitalize w-full">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {values.map((item) => (
                                    <SelectItem
                                        value={item.value.toString()} // Convert to string for consistent comparison
                                        key={item.value.toString()} // Use value as key, converted to string
                                        className='capitalize text-black'
                                    >
                                        {item.label} {/* Render the label, not the object */}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormFieldSelect;