import React, { ReactNode, forwardRef } from "react";
import { cn } from "../utils";

interface MaxWidthProps {
  children: ReactNode;
  className?: string;
  "data-bg-color"?: string;
}

const MaxWidth = forwardRef<HTMLDivElement, MaxWidthProps>(
  ({ children, className, "data-bg-color": dataBgColor }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full", className)} // ← Removed h-fit
        data-bg-color={dataBgColor}
      >
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {children}
        </div>
      </div>
    );
  }
);

MaxWidth.displayName = "MaxWidth";

export default MaxWidth;
