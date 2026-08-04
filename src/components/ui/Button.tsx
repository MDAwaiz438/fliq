import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center uppercase font-bold tracking-widest disabled:opacity-50 disabled:pointer-events-none",
          "transition-all duration-200",
          {
            "bg-(--accent) text-(--bg) hover:bg-transparent hover:text-(--accent) border border-(--accent) hover:glow": variant === "primary",
            "bg-transparent text-(--accent) border border-(--accent) hover:bg-(--accent) hover:text-(--bg)": variant === "secondary",
            "bg-transparent border border-(--border) text-(--text-primary) hover:border-(--accent) hover:text-(--accent)": variant === "outline",
            "bg-transparent text-(--text-muted) hover:text-(--accent)": variant === "ghost",
            "h-10 px-4 text-xs": size === "sm",
            "h-12 px-8 text-sm": size === "md",
            "h-14 px-10 text-base": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        style={{ transitionTimingFunction: 'var(--ease-out)' }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, cn };
