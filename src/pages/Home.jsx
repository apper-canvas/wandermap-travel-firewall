import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { tripService } from '../services'

export default function Home() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true)
      try {
        const result = await tripService.getAll()
        setTrips(result || [])
        if (result?.length > 0) {
          setSelectedTrip(result[0])
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTrips()
  }, [])

  const navigationItems = [
    { id: 'dashboard', label: 'My Trips', icon: 'Map', active: true },
    { id: 'itinerary', label: 'Itinerary', icon: 'Calendar', active: true },
    { id: 'map', label: 'Map View', icon: 'MapPin', active: true },
    { id: 'budget', label: 'Budget', icon: 'DollarSign', active: true },
    { id: 'packing', label: 'Packing', icon: 'Package', active: false },
    { id: 'documents', label: 'Documents', icon: 'FileText', active: false },
    { id: 'weather', label: 'Weather', icon: 'Cloud', active: false },
    { id: 'share', label: 'Share', icon: 'Share2', active: false }
  ]

  const handleNavClick = (itemId, isActive) => {
    if (isActive) {
      setActiveView(itemId)
    }
  }

  const updateTrips = (newTrips) => {
    setTrips(newTrips)
    if (newTrips.length > 0 && !selectedTrip) {
      setSelectedTrip(newTrips[0])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div 
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your adventures...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div 
          className="text-center p-8 glass-card rounded-2xl max-w-md mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Sidebar */}
      <motion.aside 
        className={`fixed left-0 top-0 h-full bg-white/90 backdrop-blur-20 border-r border-gray-200 z-40 transition-all duration-300 ${
          sidebarExpanded ? 'w-80' : 'w-20'
        }`}
        initial={false}
        animate={{ width: sidebarExpanded ? 320 : 80 }}
      >
        <div className="p-4">
          <motion.button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="MapPin" className="w-5 h-5 text-white" />
              </div>
              <AnimatePresence>
                {sidebarExpanded && (
                  <motion.span 
                    className="font-heading font-bold text-lg text-gray-800"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    WanderMap
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <ApperIcon 
              name={sidebarExpanded ? "ChevronLeft" : "ChevronRight"} 
              className="w-5 h-5 text-gray-500" 
            />
          </motion.button>
        </div>

        <nav className="px-4 pb-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.active)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all relative group ${
                  activeView === item.id && item.active
                    ? 'bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border border-primary/20'
                    : item.active
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                whileHover={item.active ? { scale: 1.02 } : {}}
                whileTap={item.active ? { scale: 0.98 } : {}}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={`w-5 h-5 ${item.active ? '' : 'opacity-50'}`} 
                />
                <AnimatePresence>
                  {sidebarExpanded && (
                    <motion.span 
                      className="font-medium text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {!item.active && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    Coming Soon!
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Trip Selector */}
        <AnimatePresence>
          {sidebarExpanded && trips.length > 0 && (
            <motion.div 
              className="px-4 py-4 border-t border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Current Trip
              </h3>
              {selectedTrip && (
                <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <h4 className="font-medium text-sm text-gray-800 truncate">
                    {selectedTrip.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedTrip.destination}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        className={`transition-all duration-300 ${sidebarExpanded ? 'ml-80' : 'ml-20'}`}
        initial={false}
        animate={{ marginLeft: sidebarExpanded ? 320 : 80 }}
      >
        <div className="min-h-screen p-4 lg:p-8">
          <MainFeature 
            trips={trips}
            selectedTrip={selectedTrip}
            activeView={activeView}
            onTripsUpdate={updateTrips}
            onTripSelect={setSelectedTrip}
          />
        </div>
      </motion.main>
    </div>
  )
}