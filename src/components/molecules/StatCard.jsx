import { motion } from 'framer-motion';
      import Text from '../atoms/Text';
      
      export default function StatCard({ title, value, currency, className = '', delay = 0 }) {
        return (
          &lt;motion.div 
            className={`glass-card rounded-2xl p-6 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay }}
          &gt;
            &lt;Text as="h3" className="text-lg font-semibold text-gray-800 mb-2"&gt;{title}&lt;/Text&gt;
            &lt;Text className="text-3xl font-bold"&gt;
              {currency} {value.toLocaleString()}
            &lt;/Text&gt;
          &lt;/motion.div&gt;
        );
      }