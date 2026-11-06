import { useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string; // helper text shown under the field when there is no error
  valid?: boolean; // shows a green tick
  hideLabel?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  valid = false,
  hideLabel = false,
  id,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const showHint = Boolean(hint) && !error;
  const showValid = valid && !error;
  const describedBy = error ? errorId : showHint ? hintId : undefined;

  const classes = ["field", error && "field--error", showValid && "field--valid"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <label htmlFor={inputId} className={hideLabel ? "sr-only" : undefined}>
        {label}
      </label>

      <div className="field__control">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {showValid && (
          <span className="field__check" aria-hidden="true">
            ✓
          </span>
        )}
      </div>

      {showHint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}