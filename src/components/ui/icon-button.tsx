import * as React from 'react';
import { cn } from '@/lib/utils';

export interface IconButtonProps {
  icon: React.ReactNode;
  label?: string;
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
  tabIndex?: number;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, selected: initialSelected = false, className, onClick, ...props }, ref) => {
    const [selected, setSelected] = React.useState(initialSelected);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setSelected(!selected);
      onClick?.(event);
    };

    if (label) {
      return (
        <div className="flex flex-col items-center gap-2">
          <button
            ref={ref}
            className={cn(
              "h-12 w-12 rounded-full p-0 transition-all duration-200 flex items-center justify-center border-2 transform hover:scale-[1.02] active:scale-[0.98]",
              selected
                ? "bg-primary text-white border-primary shadow-md hover:bg-primary-600 active:bg-primary-700"
                : "bg-primary-50 text-primary border-primary-200 hover:bg-primary-100 hover:border-primary-300 active:bg-primary-200 shadow-sm",
              className
            )}
            onClick={handleClick}
            {...props}
          >
            <span className="text-lg">{icon}</span>
          </button>
          <span className="text-xs text-gray-600 font-medium">{label}</span>
        </div>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          "h-12 w-12 rounded-full p-0 transition-all duration-200 flex items-center justify-center border-2 transform hover:scale-[1.02] active:scale-[0.98]",
          selected
            ? "bg-primary text-white border-primary shadow-md hover:bg-primary-600 active:bg-primary-700"
            : "bg-primary-50 text-primary border-primary-200 hover:bg-primary-100 hover:border-primary-300 active:bg-primary-200 shadow-sm",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <span className="text-lg">{icon}</span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };