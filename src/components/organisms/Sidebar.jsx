import { motion, AnimatePresence } from 'framer-motion';
      import ApperIcon from '../atoms/ApperIcon';
      import Text from '../atoms/Text';
      import NavItem from '../molecules/NavItem';
      
      export default function Sidebar({ 
        sidebarExpanded, 
        setSidebarExpanded, 
        navigationItems, 
        handleNavClick, 
        trips, 
        selectedTrip 
      }) {
        return (
          &lt;motion.aside 
            className={`fixed left-0 top-0 h-full bg-white/90 backdrop-blur-20 border-r border-gray-200 z-40 transition-all duration-300 ${
              sidebarExpanded ? 'w-80' : 'w-20'
            }`}
            initial={false}
            animate={{ width: sidebarExpanded ? 320 : 80 }}
          &gt;
            &lt;div className="p-4"&gt;
              &lt;motion.button
                onClick={() =&gt; setSidebarExpanded(!sidebarExpanded)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              &gt;
                &lt;div className="flex items-center space-x-3"&gt;
                  &lt;div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center"&gt;
                    &lt;ApperIcon name="MapPin" className="w-5 h-5 text-white" /&gt;
                  &lt;/div&gt;
                  &lt;AnimatePresence&gt;
                    {sidebarExpanded && (
                      &lt;motion.span 
                        className="font-heading font-bold text-lg text-gray-800"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      &gt;
                        WanderMap
                      &lt;/motion.span&gt;
                    )}
                  &lt;/AnimatePresence&gt;
                &lt;/div&gt;
                &lt;ApperIcon 
                  name={sidebarExpanded ? "ChevronLeft" : "ChevronRight"} 
                  className="w-5 h-5 text-gray-500" 
                /&gt;
              &lt;/motion.button&gt;
            &lt;/div&gt;
      
            &lt;nav className="px-4 pb-4"&gt;
              &lt;div className="space-y-2"&gt;
                {navigationItems.map((item) =&gt; (
                  &lt;NavItem 
                    key={item.id}
                    item={item}
                    activeView={item.activeView} // Pass activeView from parent
                    sidebarExpanded={sidebarExpanded}
                    onClick={handleNavClick}
                  /&gt;
                ))}
              &lt;/div&gt;
            &lt;/nav&gt;
      
            &lt;AnimatePresence&gt;
              {sidebarExpanded && trips.length &gt; 0 && (
                &lt;motion.div 
                  className="px-4 py-4 border-t border-gray-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                &gt;
                  &lt;Text as="h3" className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3"&gt;
                    Current Trip
                  &lt;/Text&gt;
                  {selectedTrip && (
                    &lt;div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"&gt;
                      &lt;Text as="h4" className="font-medium text-sm text-gray-800 truncate"&gt;
                        {selectedTrip.name}
                      &lt;/Text&gt;
                      &lt;Text className="text-xs text-gray-500 mt-1"&gt;
                        {selectedTrip.destination}
                      &lt;/Text&gt;
                    &lt;/div&gt;
                  )}
                &lt;/motion.div&gt;
              )}
            &lt;/AnimatePresence&gt;
          &lt;/motion.aside&gt;
        );
      }