import { motion } from 'framer-motion';
      import ApperIcon from './ApperIcon';
      
      export default function Button({ children, icon, className = '', onClick, type = 'button', disabled = false, whileHover, whileTap, ...props }) {
        return (
          <motion.button
            type={type}
            onClick={onClick}
            className={`flex items-center justify-center space-x-2 rounded-xl transition-all duration-300 ${className}`}
            whileHover={whileHover}
            whileTap={whileTap}
            disabled={disabled}
            {...props}
          >
            {icon && &lt;ApperIcon name={icon} className="w-5 h-5" /&gt;}
            {children}
          </motion.button>
        );
      }