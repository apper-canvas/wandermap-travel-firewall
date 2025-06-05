import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mb-6">
            <ApperIcon name="MapPin" className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.h1 
          className="text-6xl font-heading font-bold text-gray-800 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="text-2xl font-heading font-semibold text-gray-700 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Lost on your journey?
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The page you're looking for seems to have wandered off the map. 
          Let's get you back on track to plan your next adventure!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-medium rounded-xl hover:shadow-lift transform hover:scale-105 transition-all duration-300"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Return to Dashboard</span>
          </Link>
        </motion.div>

        <motion.div 
          className="mt-12 flex justify-center space-x-6 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05, color: "#6366F1" }}
          >
            <ApperIcon name="Compass" className="w-5 h-5" />
            <span className="text-sm">Explore</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05, color: "#10B981" }}
          >
            <ApperIcon name="Map" className="w-5 h-5" />
            <span className="text-sm">Discover</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05, color: "#F59E0B" }}
          >
            <ApperIcon name="Camera" className="w-5 h-5" />
            <span className="text-sm">Capture</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}