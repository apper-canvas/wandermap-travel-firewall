import { motion } from 'framer-motion';
      
      export default function Card({ children, className = '', initial, animate, transition, ...props }) {
        return (
          &lt;motion.div
            className={`glass-card rounded-2xl ${className}`}
            initial={initial}
            animate={animate}
            transition={transition}
            {...props}
          &gt;
            {children}
          &lt;/motion.div&gt;
        );
      }