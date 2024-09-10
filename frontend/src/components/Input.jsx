import React, { useId, forwardRef, memo } from "react";

const Input = memo(
  forwardRef(
    (
      { label, type = "text", className = "", eventHandler = null, ...props },
      ref
    ) => {
      const id = useId();
      return (
        <div className="w-full">
          {label && (
            <label
              className="mr-9 text-lg font-medium text-gray-700"
              htmlFor={id}
            >
              {label}
            </label>
          )}
          <input
            type={type}
            className={`${className}`}
            ref={ref}
            id={id}
            onChange={eventHandler}
            {...props}
          />
        </div>
      );
    }
  )
);

export default Input;
