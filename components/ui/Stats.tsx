"use client";
import { useEffect, useRef, useState } from "react";

interface StatItemProps {
  number: string;
  label: string;
  index: number;
}

export default function StatItem({ number, label }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Extract numeric value and suffix (like +)
  const numericValue = parseInt(number.replace(/\D/g, ""), 10);
  const suffix = number.replace(/[0-9]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 3000;
    const steps = 60;
    const increment = numericValue / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.min(Math.floor(increment * currentStep), numericValue));
      } else {
        setCount(numericValue);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, numericValue]);

  return (
    <div ref={elementRef} className="text-center space-y-2 py-4 px-4 sm:px-6">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600/70">
        {count}
        {suffix}
      </div>
      <p className="text-xs sm:text-sm md:text-base text-gray-500">{label}</p>
    </div>
  );
}
