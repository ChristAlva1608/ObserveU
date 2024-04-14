import { Fragment, useEffect, useState, forwardRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export type SliderProps = {
  className?: string;
  min: number;
  max: number;
  minStepsBetweenThumbs: number;
  step: number;
  disabled?: boolean;
  unit?: string;
  formatLabel?: (value: number) => string;
  value?: number[] | readonly number[];
  onValueChange?: (values: number[]) => void;
};

const Slider = forwardRef(
  (
    {
      className,
      min,
      max,
      step,
      formatLabel,
      unit,
      value,
      onValueChange,
      disabled,
      ...props
    }: SliderProps,
    ref
  ) => {
    const initialValue = Array.isArray(value) ? value : [min, max];
    const [localValues, setLocalValues] = useState(initialValue);
    const [showLabel, setShowLabel] = useState<boolean>(false);

    useEffect(() => {
      // Update localValues when the external value prop changes
      setLocalValues(Array.isArray(value) ? value : [min, max]);
    }, [min, max, value]);

    const handleValueChange = (newValues: number[]) => {
      setLocalValues(newValues);
      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    return (
      <SliderPrimitive.Root
        disabled={disabled}
        ref={ref as React.RefObject<HTMLDivElement>}
        min={min}
        max={max}
        step={step}
        value={localValues}
        onValueChange={handleValueChange}
        className={cn(
          "relative flex w-full touch-none select-none mb-6 items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20"
          )}
        >
          <SliderPrimitive.Range
            onMouseEnter={() => setShowLabel(true)}
            onMouseLeave={() => setShowLabel(false)} // should be false on default
            className={cn(
              "absolute h-full bg-primary",
              disabled && "bg-primary/20"
            )}
          />
        </SliderPrimitive.Track>
        {localValues.map((value, index) => (
          <Fragment key={index}>
            <SliderPrimitive.Thumb
              onMouseEnter={() => setShowLabel(true)}
              onMouseLeave={() => setShowLabel(false)} // should be false on default
              className={cn(
                "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                disabled && "cursor-not-allowed"
              )}
            >
              {showLabel && (
                <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 z-30 rounded-md border bg-popover text-popover-foreground shadow-sm px-2">
                  {(formatLabel ? formatLabel(value) : value) + `${unit}`}
                </div>
              )}
            </SliderPrimitive.Thumb>
          </Fragment>
        ))}
      </SliderPrimitive.Root>
    );
  }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
