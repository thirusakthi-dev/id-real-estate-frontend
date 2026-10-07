import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(
  onOutsideClick: () => void,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (
        ref.current &&
        target instanceof Node &&
        !ref.current.contains(target)
      ) {
        onOutsideClick();
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onOutsideClick]);

  return ref;
}
