import { useEffect, useState } from 'react';
      import { motion } from 'framer-motion';
      import { format, parseISO } from 'date-fns';
      import { toast } from 'react-toastify';
      import ApperIcon from '../atoms/ApperIcon';
      import Button from '../atoms/Button';
      import Text from '../atoms/Text';
      import Card from '../molecules/Card';
      import ItineraryActivity from '../molecules/ItineraryActivity';
      import AddActivityModal from './AddActivityModal';
      import { itineraryDayService } from '../../services';
      
      export default function ItinerarySection({ selectedTrip }) {
        const [itineraryDays, setItineraryDays] = useState([]);
        const [loading, setLoading] = useState(false);
        const [showActivityModal, setShowActivityModal] = useState(false);
      
        useEffect(() =&gt; {
          if (selectedTrip) {
            loadItineraryDays();
          }
        }, [selectedTrip]);
      
        const loadItineraryDays = async () =&gt; {
          if (!selectedTrip) return;
          
          setLoading(true);
          try {
            const days = await itineraryDayService.getByTripId(selectedTrip.id);
            setItineraryDays(days || []);
          } catch (error) {
            toast.error('Failed to load itinerary');
          } finally {
            setLoading(false);
          }
        };
      
        if (!selectedTrip) {
          return (
            &lt;div className="text-center py-16"&gt;
              &lt;ApperIcon name="Calendar" className="w-16 h-16 text-gray-400 mx-auto mb-4" /&gt;
              &lt;Text as="h3" className="text-xl font-heading font-semibold text-gray-600 mb-2"&gt;
                Select a Trip
              &lt;/Text&gt;
              &lt;Text className="text-gray-500"&gt;Choose a trip to view and edit its itinerary&lt;/Text&gt;
            &lt;/div&gt;
          );
        }
      
        return (
          &lt;div className="space-y-6"&gt;
            &lt;div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"&gt;
              &lt;div&gt;
                &lt;Text as="h1" className="text-3xl font-heading font-bold text-gray-800"&gt;
                  {selectedTrip.name} Itinerary
                &lt;/Text&gt;
                &lt;Text className="text-gray-600"&gt;{selectedTrip.destination}&lt;/Text&gt;
              &lt;/div&gt;
              &lt;Button
                onClick={() =&gt; setShowActivityModal(true)}
                className="px-6 py-3 bg-secondary text-white hover:bg-secondary-dark"
                icon="Plus"
              &gt;
                Add Activity
              &lt;/Button&gt;
            &lt;/div&gt;
      
            &lt;div className="space-y-6"&gt;
              {itineraryDays.map((day, index) =&gt; (
                &lt;Card
                  key={day.id}
                  className="p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                &gt;
                  &lt;Text as="h3" className="text-xl font-heading font-semibold text-gray-800 mb-4"&gt;
                    Day {day.dayNumber} - {format(parseISO(day.date), 'EEEE, MMMM dd')}
                  &lt;/Text&gt;
                  
                  {day.activities?.length &gt; 0 ? (
                    &lt;div className="space-y-3"&gt;
                      {day.activities.map((activity) =&gt; (
                        &lt;ItineraryActivity key={activity.id} activity={activity} /&gt;
                      ))}
                    &lt;/div&gt;
                  ) : (
                    &lt;div className="text-center py-8 text-gray-500"&gt;
                      &lt;ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-3 opacity-50" /&gt;
                      &lt;Text&gt;No activities planned for this day&lt;/Text&gt;
                    &lt;/div&gt;
                  )}
                &lt;/Card&gt;
              ))}
            &lt;/div&gt;
      
            &lt;AddActivityModal 
              show={showActivityModal} 
              onClose={() =&gt; setShowActivityModal(false)} 
              itineraryDays={itineraryDays}
              selectedTripId={selectedTrip?.id}
              onActivityAdded={loadItineraryDays}
            /&gt;
          &lt;/div&gt;
        );
      }