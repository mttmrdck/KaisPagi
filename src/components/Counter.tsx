import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'motion/react';

interface CounterProps {
  value: number;
  className?: string;
  prefix?: string;
}

export const Counter: React.FC<CounterProps> = ({ value, className, prefix = "" }) => {
  const count = useSpring(value, {
    mass: 1,
    stiffness: 100,
    damping: 30,
  });
  
  const display = useTransform(count, (latest) => 
    `${prefix}${Math.floor(latest).toLocaleString()}`
  );

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
};
