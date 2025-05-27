
import React from 'react';
import { cn } from "@/lib/utils";

interface RYButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const RYButton = React.forwardRef<HTMLButtonElement, RYButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ry-yellow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-ry-yellow text-ry-black hover:bg-yellow-600",
      secondary: "border-2 border-ry-yellow text-ry-yellow hover:bg-ry-yellow hover:text-ry-black",
      outline: "border border-ry-black text-ry-black hover:bg-ry-black hover:text-ry-white"
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3 text-lg"
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

RYButton.displayName = "RYButton";

export { RYButton };
