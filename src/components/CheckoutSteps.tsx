const STEPS = ["Cart", "Details", "Confirmation"];

interface CheckoutStepsProps {
  current: number; // 0-based index of the active step. Use STEPS.length when everything is done.
}

export default function CheckoutSteps({ current }: CheckoutStepsProps) {
  return (
    <ol className="steps" aria-label="Checkout progress">
      {STEPS.map((label, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        return (
          <li
            key={label}
            className={`steps__item steps__item--${state}`}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span className="steps__dot" aria-hidden="true">
              {state === "done" ? "✓" : i + 1}
            </span>
            <span className="steps__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}