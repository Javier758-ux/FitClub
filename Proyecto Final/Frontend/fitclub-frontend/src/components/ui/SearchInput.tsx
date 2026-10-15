import { useId } from "react";

interface SearchInputProps {
    label: string;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

export function SearchInput({
                                label,
                                value,
                                placeholder = "Buscar...",
                                onChange
                            }: SearchInputProps) {

    const id = useId();

    return (
        <label
            className="ui-field"
            htmlFor={id}
        >
      <span className="ui-field__label">
        {label}
      </span>

            <input
                id={id}
                type="search"
                value={value}
                placeholder={placeholder}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            />
        </label>
    );
}