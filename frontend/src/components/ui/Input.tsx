import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = "", ...props }, ref) => {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        ref={ref}
        className={`w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900 ${className}`}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
});

Input.displayName = "Input";
export default Input;