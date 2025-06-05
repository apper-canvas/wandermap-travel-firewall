import { motion } from 'framer-motion';
      import ApperIcon from '../atoms/ApperIcon';
      import Button from '../atoms/Button';
      import Text from '../atoms/Text';
      import TripCard from '../molecules/TripCard';
      
      export default function DashboardSection({ trips, onCreateTrip, onTripSelect, onDeleteTrip }) {
        return (
          &lt;div className="space-y-8"&gt;
            &lt;motion.div 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            &gt;
              &lt;div&gt;
                &lt;Text as="h1" className="text-3xl lg:text-4xl font-heading font-bold text-gray-800"&gt;
                  Your Adventures
                &lt;/Text&gt;
                &lt;Text className="text-gray-600 mt-2"&gt;Plan, organize, and track your journeys&lt;/Text&gt;
              &lt;/div&gt;
              &lt;Button
                onClick={onCreateTrip}
                className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lift transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                icon="Plus"
              &gt;
                New Trip
              &lt;/Button&gt;
            &lt;/motion.div&gt;
      
            {trips.length === 0 ? (
              &lt;motion.div 
                className="text-center py-16 px-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              &gt;
                &lt;div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full flex items-center justify-center mb-8"&gt;
                  &lt;ApperIcon name="MapPin" className="w-16 h-16 text-primary" /&gt;
                &lt;/div&gt;
                &lt;Text as="h3" className="text-2xl font-heading font-semibold text-gray-800 mb-4"&gt;
                  Start Your Journey
                &lt;/Text&gt;
                &lt;Text className="text-gray-600 max-w-md mx-auto mb-8"&gt;
                  Create your first trip and begin planning an unforgettable adventure. 
                  Organize itineraries, track expenses, and make memories.
                &lt;/Text&gt;
                &lt;Button
                  onClick={onCreateTrip}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-medium hover:shadow-lift transform hover:scale-105"
                  icon="Plus"
                &gt;
                  Plan Your First Trip
                &lt;/Button&gt;
              &lt;/motion.div&gt;
            ) : (
              &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"&gt;
                {trips.map((trip, index) =&gt; (
                  &lt;TripCard
                    key={trip.id}
                    trip={trip}
                    index={index}
                    onTripSelect={onTripSelect}
                    onDeleteTrip={onDeleteTrip}
                  /&gt;
                ))}
              &lt;/div&gt;
            )}
          &lt;/div&gt;
        );
      }