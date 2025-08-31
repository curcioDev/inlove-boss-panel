import * as React from "react";
import { Input } from "@/components/ui/input";
import { formatCurrencyInput, parseCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(
      formatCurrencyInput(value.toString())
    );

    React.useEffect(() => {
      setDisplayValue(formatCurrencyInput((value * 100).toString()));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formatted = formatCurrencyInput(inputValue);
      setDisplayValue(formatted);
      
      if (onChange) {
        const numericValue = parseCurrency(formatted);
        onChange(numericValue);
      }
    };

    return (
      <Input
        type="text"
        className={cn(className)}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };