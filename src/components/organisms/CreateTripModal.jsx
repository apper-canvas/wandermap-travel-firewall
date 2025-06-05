import { useState } from 'react';
      import { AnimatePresence, motion } from 'framer-motion';
      import { toast } from 'react-toastify';
      import { format, parseISO, addDays } from 'date-fns';
      import FormField from '../molecules/FormField';
      import Button from '../atoms/Button';
      import Text from '../atoms/Text';
      import Card from '../molecules/Card';
      import { tripService, itineraryDayService } from '../../services';
      
      export default function CreateTripModal({ show, onClose, onTripCreated, onTripSelected }) {
        const [loading, setLoading] = useState(false);
        const [newTrip, setNewTrip] = useState({
          name: '',
          startDate: '',
          endDate: '',
          destination: '',
          coverImage: '',
          budget: '',
          currency: 'USD'
        });
      
        const handleCreateTrip = async (e) =&gt; {
          e.preventDefault();
          if (!newTrip.name || !newTrip.startDate || !newTrip.endDate || !newTrip.destination) {
            toast.error('Please fill in all required fields');
            return;
          }
      
          setLoading(true);
          try {
            const tripData = {
              ...newTrip,
              budget: parseFloat(newTrip.budget) || 0,
              coverImage: newTrip.coverImage || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
            };
            
            const createdTrip = await tripService.create(tripData);
            const updatedTrips = await tripService.getAll();
            onTripCreated(updatedTrips);
            onTripSelected(createdTrip);
            
            const startDate = parseISO(newTrip.startDate);
            const endDate = parseISO(newTrip.endDate);
            const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            
            for (let i = 0; i &lt; dayCount; i++) {
              await itineraryDayService.create({
                tripId: createdTrip.id,
                date: format(addDays(startDate, i), 'yyyy-MM-dd'),
                dayNumber: i + 1,
                activities: []
              });
            }
            
            setNewTrip({
              name: '',
              startDate: '',
              endDate: '',
              destination: '',
              coverImage: '',
              budget: '',
              currency: 'USD'
            });
            onClose();
            toast.success('Trip created successfully!');
          } catch (error) {
            toast.error('Failed to create trip');
          } finally {
            setLoading(false);
          }
        };
      
        return (
          &lt;AnimatePresence&gt;
            {show && (
              &lt;motion.div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
              &gt;
                &lt;Card 
                  className="p-8 w-full max-w-md"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) =&gt; e.stopPropagation()}
                &gt;
                  &lt;Text as="h2" className="text-2xl font-heading font-bold text-gray-800 mb-6"&gt;Create New Trip&lt;/Text&gt;
                  
                  &lt;form onSubmit={handleCreateTrip} className="space-y-4"&gt;
                    &lt;FormField
                      type="text"
                      placeholder="Trip name"
                      value={newTrip.name}
                      onChange={(e) =&gt; setNewTrip({...newTrip, name: e.target.value})}
                      required
                    /&gt;
                    
                    &lt;FormField
                      type="text"
                      placeholder="Destination"
                      value={newTrip.destination}
                      onChange={(e) =&gt; setNewTrip({...newTrip, destination: e.target.value})}
                      required
                    /&gt;
                    
                    &lt;div className="grid grid-cols-2 gap-4"&gt;
                      &lt;FormField
                        type="date"
                        value={newTrip.startDate}
                        onChange={(e) =&gt; setNewTrip({...newTrip, startDate: e.target.value})}
                        required
                      /&gt;
                      &lt;FormField
                        type="date"
                        value={newTrip.endDate}
                        onChange={(e) =&gt; setNewTrip({...newTrip, endDate: e.target.value})}
                        required
                      /&gt;
                    &lt;/div&gt;
                    
                    &lt;div className="grid grid-cols-3 gap-4"&gt;
                      &lt;FormField
                        type="number"
                        placeholder="Budget"
                        value={newTrip.budget}
                        onChange={(e) =&gt; setNewTrip({...newTrip, budget: e.target.value})}
                        className="col-span-2"
                      /&gt;
                      &lt;FormField
                        type="select"
                        value={newTrip.currency}
                        onChange={(e) =&gt; setNewTrip({...newTrip, currency: e.target.value})}
                        options={[
                          { value: 'USD', label: 'USD' },
                          { value: 'EUR', label: 'EUR' },
                          { value: 'GBP', label: 'GBP' },
                          { value: 'JPY', label: 'JPY' }
                        ]}
                      /&gt;
                    &lt;/div&gt;
      
                    &lt;div className="flex space-x-4 pt-4"&gt;
                      &lt;Button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50"
                      &gt;
                        Cancel
                      &lt;/Button&gt;
                      &lt;Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lift disabled:opacity-50"
                      &gt;
                        {loading ? 'Creating...' : 'Create Trip'}
                      &lt;/Button&gt;
                    &lt;/div&gt;
                  &lt;/form&gt;
                &lt;/Card&gt;
              &lt;/motion.div&gt;
            )}
          &lt;/AnimatePresence&gt;
        );
      }