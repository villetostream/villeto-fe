import React, { JSX, useEffect, useState } from "react";
import Select from "react-select";
import { Controller, Control } from "react-hook-form";

interface ISelect {
  label: string;
  value: string | number | boolean;
}

interface CustomSelectProps {
  fieldProp?: {
    required?: boolean;
    error?: string;
    description?: string;
    invalid?: boolean;
  };
  selectProp?: {
    placeholder?: string;
    isDisabled?: boolean;
    isClearable?: boolean;
    isSearchable?: boolean;
    isMultiple?: boolean;
  };
  data: Array<ISelect>;
  label: string;
  name?: string;
  control?: Control<any>;
  value?: string | string[] | number | number[] | boolean | boolean[];
  onChange?: (
    value: string | string[] | number | number[] | boolean | boolean[] | null
  ) => void;
  getId?: (value: any) => void;
}

export const CustomSelect = ({
  fieldProp,
  selectProp,
  data,
  label,
  name,
  control,
  value,
  getId,
  onChange,
}: CustomSelectProps): JSX.Element => {
  // Local state for direct control mode (when not using react-hook-form)
  const [localValue, setLocalValue] = useState<
    string | number | boolean | string[] | number[] | boolean[] | null | undefined
  >(value);

  useEffect(() => {
    setLocalValue(value);
    console.log(value);
  }, [value]);

  // Handle direct changes when not using react-hook-form
  const handleDirectChange = (selected: ISelect | ISelect[] | null) => {
    if (selectProp?.isMultiple) {
      const values = selected
        ? (selected as ISelect[]).map((item) => item.value)
        : [];

      setLocalValue(values as string[] | number[] | boolean[]);
      onChange?.(values as string[] | number[] | boolean[]);
    } else {
      const singleValue = selected ? (selected as ISelect).value : null;
      setLocalValue(singleValue);
      onChange?.(singleValue);
    }
  };

  const renderSelect = (field?: any) => {
    // Determine if we're using react-hook-form or direct control
    const isDirectControl = !field;
    const currentValue = isDirectControl ? localValue : field?.value;

    // For direct control, use the provided onChange handler
    const handleChange = isDirectControl
      ? handleDirectChange
      : (selected: ISelect | ISelect[] | null) => {
        if (selectProp?.isMultiple) {
          field.onChange(
            selected ? (selected as ISelect[]).map((item) => item.value) : []
          );
        } else {
          field.onChange(selected ? (selected as ISelect).value : null);
        }
      };

    // Calculate the correct value for the Select component
    const selectValue = selectProp?.isMultiple
      ? data.filter((option) =>
        Array.isArray(currentValue)
          ? currentValue.map(String).includes(option.value.toString()) // normalize
          : false
      )
      : currentValue === null ||
        currentValue === undefined ||
        currentValue === ""
        ? null
        : data?.find((option) => option.value.toString() === currentValue.toString()) || null;


    // setFacilityName(currentValue)
    return (
      <div className="flex flex-col space-y-2">
        {/* Label */}
        <label className="text-sm font-medium text-gray-700">
          {label}{" "}
          {fieldProp?.required && <span className="text-red-500">*</span>}
        </label>

        {/* Select Component */}
        <Select
          options={data}
          placeholder={selectProp?.placeholder || "Select an option"}
          isDisabled={selectProp?.isDisabled}
          isClearable={selectProp?.isClearable}
          isSearchable={selectProp?.isSearchable}
          isMulti={selectProp?.isMultiple}
          className="react-select-container"
          classNamePrefix="react-select"
          value={selectValue}
          onChange={handleChange}

        />

        {/* Description */}
        {fieldProp?.description && (
          <p className="text-sm text-gray-500">{fieldProp.description}</p>
        )}

        {/* Error Message */}
        {fieldProp?.invalid && fieldProp?.error && (
          <p className="text-sm text-red-500">{fieldProp.error}</p>
        )}
      </div>
    );
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => renderSelect(field)}
      />
    );
  }

  return renderSelect();
};
