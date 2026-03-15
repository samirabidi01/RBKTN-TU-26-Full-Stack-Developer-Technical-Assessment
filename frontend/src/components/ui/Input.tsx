import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div>
        {label ? (
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {label}
          </label>
        ) : null}

        <input
          ref={ref}
          className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 ${className}`}
          {...props}
        />

        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;