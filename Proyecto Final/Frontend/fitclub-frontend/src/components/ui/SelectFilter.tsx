import { useId } from "react";

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectFilterProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
}

export function SelectFilter({
                                 label,
                                 value,
                                 options,
                                 onChange
                             }: SelectFilterProps) {

    const id = useId();

    return (
        <label
            className="ui-field"
            htmlFor={id}
        >
      <span className="ui-field__label">
        {label}
      </span>

            <select
                id={id}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}