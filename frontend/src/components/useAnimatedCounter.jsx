import { useState, useEffect, useRef } from 'react';

export default function useAnimatedCounter(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0);
  const targetRef = useRef(targetValue);
  const animationRef = useRef();

  useEffect(() => {
    targetRef.current = targetValue;
    const startTime = performance.now();
    const startValue = displayValue;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(startValue + (targetValue - startValue) * progress);
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
}