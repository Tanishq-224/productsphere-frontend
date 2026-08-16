import { useEffect, useState } from "react";

const useReveal = ({
  threshold = 0.15,
  rootMargin = "0px 0px -50px 0px",
  once = true,
  delay = 0,
  triggerOnMount = false,
} = {}) => {
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return;

    element.style.transitionDelay = `${delay}ms`;

    // For navbar / elements that should animate immediately
    if (triggerOnMount) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.classList.add("is-visible");
        });
      });

      return () => {
        cancelAnimationFrame(frame);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");

          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          element.classList.remove("is-visible");
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    element,
    threshold,
    rootMargin,
    once,
    delay,
    triggerOnMount,
  ]);

  return setElement;
};

export default useReveal;