import { motion } from 'framer-motion';
      import Text from '../atoms/Text';
      
      export default function BudgetProgress({ totalBudget, totalSpent }) {
        const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      
        return (
          &lt;motion.div 
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          &gt;
            &lt;div className="flex items-center justify-between mb-4"&gt;
              &lt;Text as="h3" className="text-lg font-semibold text-gray-800"&gt;Budget Progress&lt;/Text&gt;
              &lt;Text className="text-sm text-gray-600"&gt;{Math.round(budgetProgress)}%&lt;/Text&gt;
            &lt;/div&gt;
            &lt;div className="w-full bg-gray-200 rounded-full h-4"&gt;
              &lt;motion.div 
                className={`budget-progress h-4 rounded-full ${
                  budgetProgress > 100 ? 'bg-red-500' : budgetProgress > 80 ? 'bg-amber-500' : 'bg-secondary'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              /&gt;
            &lt;/div&gt;
          &lt;/motion.div&gt;
        );
      }