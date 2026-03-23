"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

const BlurFade = ({
  children,
  className,
  variant,
  /** Short duration — blur filter is off by default (expensive) */
  duration = 0.22,
  delay = 0,
  yOffset = 4,
  inView = true,
  /** Expand root bottom so reveals start slightly before elements enter the viewport */
  inViewMargin = "0px 0px 200px 0px",
  /** `0px` avoids costly filter animations during scroll (major perf win) */
  blur = "0px",
}: BlurFadeProps) => {
  const ref = useRef(null);
  const inViewResult = useInView(ref, {
    once: true,
    margin: inViewMargin,
    /** Fire as soon as a slice of the element is visible */
    amount: "some",
  });
  const isInView = !inView || inViewResult;

  const defaultVariants: Variants =
    blur === "0px"
      ? {
          hidden: { y: yOffset, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }
      : {
          hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
          visible: { y: 0, opacity: 1, filter: "blur(0px)" },
        };
  const combinedVariants = variant || defaultVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={combinedVariants}
      transition={{
        delay: 0.01 + delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default BlurFade;
