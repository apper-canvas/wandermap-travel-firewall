import { motion, AnimatePresence } from 'framer-motion';
      import ApperIcon from '../atoms/ApperIcon';
      import Text from '../atoms/Text';
      
      export default function NavItem({ item, activeView, sidebarExpanded, onClick }) {
        const isActive = item.active;
        const isSelected = activeView === item.id && isActive;
      
        return (
          &lt;motion.button
            key={item.id}
            onClick={() =&gt; onClick(item.id, isActive)}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all relative group ${
              isSelected
                ? 'bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border border-primary/20'
                : isActive
                ? 'hover:bg-gray-100 text-gray-700'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            whileHover={isActive ? { scale: 1.02 } : {}}
            whileTap={isActive ? { scale: 0.98 } : {}}
          &gt;
            &lt;ApperIcon 
              name={item.icon} 
              className={`w-5 h-5 ${isActive ? '' : 'opacity-50'}`} 
            /&gt;
            &lt;AnimatePresence&gt;
              {sidebarExpanded && (
                &lt;motion.span 
                  className="font-medium text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                &gt;
                  {item.label}
                &lt;/motion.span&gt;
              )}
            &lt;/AnimatePresence&gt;
            
            {!isActive && (
              &lt;div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"&gt;
                Coming Soon!
              &lt;/div&gt;
            )}
          &lt;/motion.button&gt;
        );
      }