import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  children?: ReactNode;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, children, className = "", id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId || generatedId;
    const helperId = `${id}-helper`;

    return (
      <div className="w-full flex flex-col gap-(--space-1)">
        <label
          htmlFor={id}
          className="font-heading font-semibold uppercase text-muted tracking-[0.06em]"
        >
          {label}
        </label>
        {children || (
          <input
            ref={ref}
            id={id}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error || helperText ? helperId : undefined}
            className={[
              "w-full bg-white border border-border rounded-sm",
              "p-(--space-3) font-body",
              "outline-none transition-colors duration-(--dur-base)",
              "placeholder:text-muted/60 placeholder:uppercase placeholder:tracking-widest",
              error
                ? "border-danger focus:border-danger"
                : "focus:border-acid focus:ring-1 focus:ring-acid",
              className,
            ].join(" ")}
            {...props}
          />
        )}
        {(error || helperText) && (
          <p
            id={helperId}
            className={`text-(--text-micro) ${error ? "text-danger" : "text-muted"}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
export default FormField;
