// components/form fields/formFieldInput.tsx
import React, { useState } from 'react'
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from '../ui/form'
import { Input } from '../ui/input'
import { Eye, EyeOff } from 'lucide-react'

interface FormFieldInputProps {
    type?: React.HTMLInputTypeAttribute;
    name: string;
    label: string;
    placeholder: string;
    control: any;
    description?: string;
    inputMode?: "search" | "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | undefined;
    showPasswordToggle?: boolean;
}

const FormFieldInput = ({
    name,
    label,
    placeholder,
    control,
    description,
    type = "text",
    inputMode,
    showPasswordToggle = false
}: FormFieldInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                className='input pr-10'
                                type={inputType}
                                placeholder={placeholder}
                                inputMode={inputMode}
                                {...field}
                            />
                            {showPasswordToggle && type === 'password' && (
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            )}
                        </div>
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