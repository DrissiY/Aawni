import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-600 text-white shadow hover:bg-cyan-700 active:bg-cyan-800",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 active:bg-red-700",
        outline:
          "border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100",
        secondary:
          "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300",
        ghost: "hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200",
        link: "text-cyan-600 underline-offset-4 hover:underline hover:text-cyan-700",
        icon: "bg-cyan-50 text-cyan-600 border border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300 active:bg-cyan-200",
        "icon-selected": "bg-cyan-600 text-white border border-cyan-600 shadow-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base font-semibold",
        icon: "h-12 w-12 rounded-full",
        "icon-sm": "h-8 w-8 rounded-full",
        "icon-lg": "h-16 w-16 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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