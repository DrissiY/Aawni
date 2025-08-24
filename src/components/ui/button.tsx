import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-sans",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-md hover:bg-primary-600 hover:text-white active:bg-primary-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-secondary text-neutral shadow-md hover:bg-secondary-600 active:bg-secondary-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border-2 border-primary bg-transparent text-primary shadow-sm hover:bg-primary hover:text-white active:bg-primary-700 transform hover:scale-[1.02] active:scale-[0.98]",
        ghost: 
          "bg-transparent text-neutral hover:bg-neutral-100 active:bg-neutral-200 transform hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-error text-white shadow-md hover:bg-red-600 active:bg-red-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        success:
          "bg-success text-white shadow-md hover:bg-green-600 active:bg-green-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        warning:
          "bg-warning text-neutral shadow-md hover:bg-yellow-600 hover:text-white active:bg-yellow-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary-600 bg-transparent shadow-none transform hover:scale-[1.02] active:scale-[0.98]",
        icon:
          "bg-transparent text-neutral hover:bg-neutral-100 active:bg-neutral-200 transform hover:scale-[1.02] active:scale-[0.98]",
        "icon-selected":
          "bg-primary text-white shadow-md hover:bg-primary-600 hover:text-white active:bg-primary-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-4 text-xs font-medium",
        md: "h-10 px-6 text-sm font-medium",
        lg: "h-12 px-8 text-base font-semibold",
        xl: "h-14 px-10 text-lg font-semibold",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
        "icon-xl": "h-14 w-14 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };



// Toggle Icon Button Component for checkable/toggleable actions
export interface ToggleIconButtonProps {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
  onToggle?: (active: boolean) => void;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
  tabIndex?: number;
}

const ToggleIconButton = React.forwardRef<HTMLButtonElement, ToggleIconButtonProps>(
  ({ icon, label, active = false, onToggle, className, ...props }, ref) => {
    const handleClick = () => {
      onToggle?.(!active);
    };

    if (label) {
      return (
        <div className="flex flex-col items-center gap-2">
          <Button
            ref={ref}
            variant={active ? "icon-selected" : "icon"}
            size="icon"
            className={className}
            onClick={handleClick}
            {...props}
          >
            <div className="text-lg">{icon}</div>
          </Button>
          <span className="text-xs font-medium text-center text-gray-700 leading-tight max-w-16">
            {label}
          </span>
        </div>
      );
    }
    
    return (
      <Button
        ref={ref}
        variant={active ? "icon-selected" : "icon"}
        size="icon"
        className={className}
        onClick={handleClick}
        {...props}
      >
        <div className="text-lg">{icon}</div>
      </Button>
    );
  }
);
ToggleIconButton.displayName = "ToggleIconButton";

export { ToggleIconButton };