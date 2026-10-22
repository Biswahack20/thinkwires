import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal
 * Delivers directional Framer Motion entrance animations triggered by viewport scrolling.
 * Supports: 'up', 'down', 'left', 'right', 'zoom', 'fade'
 */
export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.75,
  distance = 60,
  className = '',
  style = {},
  once = true,
  amount = 0.15,
  ...props
}) => {
  const getOffset = () => {
    switch (direction) {
      case 'left':
        return { x: -distance, y: 0 };
      case 'right':
        return { x: distance, y: 0 };
      case 'down':
        return { x: 0, y: -distance };
      case 'zoom':
        return { x: 0, y: 0, scale: 0.93 };
      case 'fade':
        return { x: 0, y: 0 };
      case 'up':
      default:
        return { x: 0, y: distance };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...offset,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      viewport={{ once, amount }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScrollStagger & ScrollStaggerItem
 * Staggers animations across child elements in card grids, lists, and feature blocks.
 */
export const ScrollStagger = ({
  children,
  staggerDelay = 0.12,
  className = '',
  amount = 0.15,
  once = true,
  style = {},
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const ScrollStaggerItem = ({
  children,
  direction = 'up',
  distance = 50,
  duration = 0.7,
  className = '',
  style = {},
  ...props
}) => {
  const x =
    direction === 'left' ? -distance : direction === 'right' ? distance : 0;
  const y =
    direction === 'up' ? distance : direction === 'down' ? -distance : 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x, y, scale: 0.95 },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            duration,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
