
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  required?: boolean;
  autoComplete?: string;
}

const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  className,
  required = false,
  autoComplete,
}: InputFieldProps) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const handleBlur = () => {
    setFocused(false);
    setHasInteracted(true);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative rounded-lg transition-all duration-300 border",
          focused ? "border-primary shadow-sm" : "border-input",
          error && hasInteracted ? "border-destructive/70" : ""
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            "absolute transition-all duration-200 px-2 pointer-events-none",
            (focused || value) 
              ? "-top-2 left-3 text-xs bg-background px-1"
              : "left-3 top-3 text-sm text-muted-foreground",
            focused ? "text-primary" : "",
            error && hasInteracted ? "text-destructive" : ""
          )}
        >
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        
        <div className="relative">
          <input
            id={id}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            placeholder={focused ? placeholder : ""}
            className={cn(
              "w-full bg-transparent px-4 py-3 text-foreground outline-none rounded-lg",
              "placeholder:text-muted-foreground/70"
            )}
            autoComplete={autoComplete}
          />
          
          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          )}
        </div>
      </div>
      
      {error && hasInteracted && (
        <p className="text-destructive text-xs animate-slide-down px-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
