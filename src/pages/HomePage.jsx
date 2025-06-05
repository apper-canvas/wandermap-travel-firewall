import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/atoms/ApperIcon';
import HomeTemplate from '../components/templates/HomeTemplate';
import { tripService } from '../services';

export default function HomePage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      try {
        const result = await tripService.getAll();
        setTrips(result || []);
        if (result?.length > 0) {
          setSelectedTrip(result[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'My Trips', icon: 'Map', active: true },
    { id: 'itinerary', label: 'Itinerary', icon: 'Calendar', active: true },
    { id: 'map', label: 'Map View', icon: 'MapPin', active: true },
    { id: 'budget', label: 'Budget', icon: 'DollarSign', active: true },
    { id: 'packing', label: 'Packing', icon: 'Package', active: false },
    { id: 'documents', label: 'Documents', icon: 'FileText', active: false },
    { id: 'weather', label: 'Weather', icon: 'Cloud', active: false },
    { id: 'share', label: 'Share', icon: 'Share2', active: false }
  ];

  const handleNavClick = (itemId, isActive) => {
    if (isActive) {
      setActiveView(itemId);
    }
  };

  const updateTrips = (newTrips) => {
    setTrips(newTrips);
    if (newTrips.length > 0 && !selectedTrip) {
      setSelectedTrip(newTrips[0]);
    }
  };

  const handleCreateTrip = (newTrips) => {
    setTrips(newTrips);
  };

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    try {
      await tripService.delete(tripId);
      const updatedTrips = await tripService.getAll();
      updateTrips(updatedTrips);
      
      if (selectedTrip?.id === tripId) {
        setSelectedTrip(updatedTrips[0] || null);
      }
      
      alert('Trip deleted successfully!'); // Using alert instead of toast to avoid new dependency
    } catch (error) {
      alert('Failed to delete trip'); // Using alert instead of toast to avoid new dependency
    }
  };

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
    );
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
    );
  }

  return (
    <HomeTemplate
      trips={trips}
      selectedTrip={selectedTrip}
      activeView={activeView}
      sidebarExpanded={sidebarExpanded}
      setSidebarExpanded={setSidebarExpanded}
      navigationItems={navigationItems}
      handleNavClick={handleNavClick}
      onCreateTrip={handleCreateTrip}
      onTripSelect={setSelectedTrip}
      onDeleteTrip={handleDeleteTrip}
    />
  );
}