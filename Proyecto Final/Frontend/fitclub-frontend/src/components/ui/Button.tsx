import type {
    ButtonHTMLAttributes,
    ReactNode
} from "react";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "danger"
    | "ghost";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {

    variant?: ButtonVariant;
    loading?: boolean;
    children: ReactNode;
}

export function Button({
                           variant = "primary",
                           loading = false,
                           disabled,
                           className = "",
                           children,
                           ...props
                       }: ButtonProps) {

    return (
        <button
            {...props}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={
                `ui-button ui-button--${variant} ${className}`.trim()
            }
        >
            {loading
                ? "Procesando..."
                : children}
        </button>
    );
}