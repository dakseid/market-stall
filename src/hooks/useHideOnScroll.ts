import { useEffect, useState } from "react";

// Returns true when the user is scrolling down (and is past the top of the page)
export function useHideOnScroll(threshold = 8) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (ticking) return; // already scheduled for this frame
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) > threshold) {
          setHidden(y > lastY && y > 120);
          lastY = y;
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}