import { motion } from 'framer-motion';
      import { format, parseISO } from 'date-fns';
      import ApperIcon from '../atoms/ApperIcon';
      import Text from '../atoms/Text';
      
      export default function TripCard({ trip, index, onTripSelect, onDeleteTrip }) {
        return (
          &lt;motion.div
            key={trip.id}
            className="trip-card glass-card rounded-2xl overflow-hidden cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() =&gt; onTripSelect(trip)}
          &gt;
            &lt;div className="relative h-48 overflow-hidden"&gt;
              &lt;img 
                src={trip.coverImage} 
                alt={trip.name}
                className="w-full h-full object-cover"
              /&gt;
              &lt;div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /&gt;
              &lt;button
                onClick={(e) =&gt; {
                  e.stopPropagation();
                  onDeleteTrip(trip.id);
                }}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              &gt;
                &lt;ApperIcon name="Trash2" className="w-4 h-4" /&gt;
              &lt;/button&gt;
              &lt;div className="absolute bottom-3 left-3 text-white"&gt;
                &lt;Text as="h3" className="font-heading font-bold text-lg"&gt;{trip.name}&lt;/Text&gt;
                &lt;Text className="text-sm opacity-90"&gt;{trip.destination}&lt;/Text&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div className="p-4"&gt;
              &lt;div className="flex items-center justify-between text-sm text-gray-600 mb-3"&gt;
                &lt;span&gt;{format(parseISO(trip.startDate), 'MMM dd')}&lt;/span&gt;
                &lt;span&gt;-&lt;/span&gt;
                &lt;span&gt;{format(parseISO(trip.endDate), 'MMM dd, yyyy')}&lt;/span&gt;
              &lt;/div&gt;
              {trip.budget &gt; 0 && (
                &lt;div className="flex items-center justify-between"&gt;
                  &lt;Text className="text-sm text-gray-600"&gt;Budget&lt;/Text&gt;
                  &lt;Text className="font-semibold text-secondary"&gt;
                    {trip.currency} {trip.budget.toLocaleString()}
                  &lt;/Text&gt;
                &lt;/div&gt;
              )}
            &lt;/div&gt;
          &lt;/motion.div&gt;
        );
      }