import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline-accent" | "destructive" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {

    const baseStyles = [
      "font-heading font-bold uppercase tracking-[0.08em]",
      "inline-flex items-center justify-center cursor-pointer",
      "transition-all duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
      "active:translate-y-0",
      "disabled:bg-charcoal disabled:text-muted disabled:cursor-not-allowed disabled:border-none disabled:hover:translate-y-0",
      "focus-visible:outline-2 focus-visible:outline-acid focus-visible:outline-offset-2",
    ].join(" ");

    const variants: Record<string, string> = {
      primary: "bg-bone text-white hover:bg-black/85 hover:-translate-y-px shadow-xs",
      secondary: "bg-obsidian text-bone border border-border hover:bg-charcoal hover:-translate-y-px",
      ghost: "bg-transparent border border-border text-bone hover:bg-black/5",
      "outline-accent": "bg-white border-2 border-acid text-acid hover:bg-acid hover:text-white hover:-translate-y-px shadow-xs",
      destructive: "bg-transparent border border-danger text-danger hover:bg-danger/10",
      danger: "bg-danger text-white hover:opacity-90 hover:-translate-y-px shadow-xs",
    };

    const sizes: Record<string, string> = {
      sm: "h-8 px-4 text-[var(--text-micro)]",
      md: "h-[clamp(2.5rem,4vw,3rem)] px-[var(--space-5)] text-[var(--text-small)]",
      lg: "h-[clamp(3rem,5vw,3.5rem)] px-[var(--space-6)] text-[var(--text-small)]",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
