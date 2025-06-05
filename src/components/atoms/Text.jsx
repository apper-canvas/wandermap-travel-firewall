import { motion } from 'framer-motion';
      
      export default function Text({ as = 'p', children, className = '', ...props }) {
        const Component = motion[as] || as;
      
        return (
          &lt;Component className={className} {...props}&gt;
            {children}
          &lt;/Component&gt;
        );
      }