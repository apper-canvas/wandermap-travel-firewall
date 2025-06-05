import { useState } from 'react';
      import { AnimatePresence, motion } from 'framer-motion';
      import { format, parseISO } from 'date-fns';
      import { toast } from 'react-toastify';
      import FormField from '../molecules/FormField';
      import Button from '../atoms/Button';
      import Text from '../atoms/Text';
      import Card from '../molecules/Card';
      import { activityService } from '../../services';
      
      export default function AddActivityModal({ show, onClose, itineraryDays, selectedTripId, onActivityAdded }) {
        const [newActivity, setNewActivity] = useState({
          title: '',
          startTime: '',
          endTime: '',
          location: '',
          notes: '',
          category: 'sightseeing',
          dayId: ''
        });
      
        const handleAddActivity = async (e) =&gt; {
          e.preventDefault();
          if (!newActivity.title || !newActivity.startTime || !newActivity.dayId) {
            toast.error('Please fill in required fields');
            return;
          }
      
          try {
            await activityService.create({
              ...newActivity,
              tripId: selectedTripId,
              coordinates: { lat: 0, lng: 0 } // Placeholder coordinates
            });
            
            onActivityAdded();
            setNewActivity({
              title: '',
              startTime: '',
              endTime: '',
              location: '',
              notes: '',
              category: 'sightseeing',
              dayId: ''
            });
            onClose();
            toast.success('Activity added successfully!');
          } catch (error) {
            toast.error('Failed to add activity');
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
                  &lt;Text as="h2" className="text-2xl font-heading font-bold text-gray-800 mb-6"&gt;Add Activity&lt;/Text&gt;
                  
                  &lt;form onSubmit={handleAddActivity} className="space-y-4"&gt;
                    &lt;FormField
                      type="select"
                      value={newActivity.dayId}
                      onChange={(e) =&gt; setNewActivity({...newActivity, dayId: e.target.value})}
                      options={[
                        { value: '', label: 'Select Day', disabled: true },
                        ...(itineraryDays || []).map((day) =&gt; ({
                          value: day.id,
                          label: `Day ${day.dayNumber} - ${format(parseISO(day.date), 'MMM dd')}`
                        }))
                      ]}
                      className="focus:ring-secondary"
                      required
                    /&gt;
                    
                    &lt;FormField
                      type="text"
                      placeholder="Activity title"
                      value={newActivity.title}
                      onChange={(e) =&gt; setNewActivity({...newActivity, title: e.target.value})}
                      className="focus:ring-secondary"
                      required
                    /&gt;
                    
                    &lt;div className="grid grid-cols-2 gap-4"&gt;
                      &lt;FormField
                        type="time"
                        value={newActivity.startTime}
                        onChange={(e) =&gt; setNewActivity({...newActivity, startTime: e.target.value})}
                        className="focus:ring-secondary"
                        required
                      /&gt;
                      &lt;FormField
                        type="time"
                        value={newActivity.endTime}
                        onChange={(e) =&gt; setNewActivity({...newActivity, endTime: e.target.value})}
                        className="focus:ring-secondary"
                      /&gt;
                    &lt;/div&gt;
                    
                    &lt;FormField
                      type="text"
                      placeholder="Location"
                      value={newActivity.location}
                      onChange={(e) =&gt; setNewActivity({...newActivity, location: e.target.value})}
                      className="focus:ring-secondary"
                    /&gt;
                    
                    &lt;FormField
                      type="select"
                      value={newActivity.category}
                      onChange={(e) =&gt; setNewActivity({...newActivity, category: e.target.value})}
                      options={[
                        { value: 'sightseeing', label: 'Sightseeing' },
                        { value: 'food', label: 'Food & Dining' },
                        { value: 'transport', label: 'Transportation' },
                        { value: 'accommodation', label: 'Accommodation' },
                        { value: 'shopping', label: 'Shopping' },
                        { value: 'entertainment', label: 'Entertainment' }
                      ]}
                      className="focus:ring-secondary"
                    /&gt;
                    
                    &lt;FormField
                      type="textarea"
                      placeholder="Notes (optional)"
                      value={newActivity.notes}
                      onChange={(e) =&gt; setNewActivity({...newActivity, notes: e.target.value})}
                      className="focus:ring-secondary"
                      rows="3"
                    /&gt;
      
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
                        className="flex-1 px-6 py-3 bg-secondary text-white hover:bg-secondary-dark"
                      &gt;
                        Add Activity
                      &lt;/Button&gt;
                    &lt;/div&gt;
                  &lt;/form&gt;
                &lt;/Card&gt;
              &lt;/motion.div&gt;
            )}
          &lt;/AnimatePresence&gt;
        );
      }