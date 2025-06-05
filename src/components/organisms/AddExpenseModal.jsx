import { useState } from 'react';
      import { AnimatePresence, motion } from 'framer-motion';
      import { toast } from 'react-toastify';
      import FormField from '../molecules/FormField';
      import Button from '../atoms/Button';
      import Text from '../atoms/Text';
      import Card from '../molecules/Card';
      import { expenseService } from '../../services';
      
      export default function AddExpenseModal({ show, onClose, selectedTripId, onExpenseAdded }) {
        const [newExpense, setNewExpense] = useState({
          category: 'food',
          amount: '',
          description: '',
          date: ''
        });
      
        const handleAddExpense = async (e) =&gt; {
          e.preventDefault();
          if (!newExpense.amount || !newExpense.description || !newExpense.date) {
            toast.error('Please fill in all fields');
            return;
          }
      
          try {
            await expenseService.create({
              ...newExpense,
              tripId: selectedTripId,
              amount: parseFloat(newExpense.amount)
            });
            
            onExpenseAdded();
            setNewExpense({
              category: 'food',
              amount: '',
              description: '',
              date: ''
            });
            onClose();
            toast.success('Expense added successfully!');
          } catch (error) {
            toast.error('Failed to add expense');
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
                  &lt;Text as="h2" className="text-2xl font-heading font-bold text-gray-800 mb-6"&gt;Add Expense&lt;/Text&gt;
                  
                  &lt;form onSubmit={handleAddExpense} className="space-y-4"&gt;
                    &lt;FormField
                      type="select"
                      value={newExpense.category}
                      onChange={(e) =&gt; setNewExpense({...newExpense, category: e.target.value})}
                      options={[
                        { value: 'food', label: 'Food & Dining' },
                        { value: 'transport', label: 'Transportation' },
                        { value: 'accommodation', label: 'Accommodation' },
                        { value: 'activities', label: 'Activities' },
                        { value: 'shopping', label: 'Shopping' }
                      ]}
                      className="focus:ring-accent"
                    /&gt;
                    
                    &lt;FormField
                      type="number"
                      placeholder="Amount"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) =&gt; setNewExpense({...newExpense, amount: e.target.value})}
                      className="focus:ring-accent"
                      required
                    /&gt;
                    
                    &lt;FormField
                      type="text"
                      placeholder="Description"
                      value={newExpense.description}
                      onChange={(e) =&gt; setNewExpense({...newExpense, description: e.target.value})}
                      className="focus:ring-accent"
                      required
                    /&gt;
                    
                    &lt;FormField
                      type="date"
                      value={newExpense.date}
                      onChange={(e) =&gt; setNewExpense({...newExpense, date: e.target.value})}
                      className="focus:ring-accent"
                      required
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
                        className="flex-1 px-6 py-3 bg-accent text-white hover:bg-amber-600"
                      &gt;
                        Add Expense
                      &lt;/Button&gt;
                    &lt;/div&gt;
                  &lt;/form&gt;
                &lt;/Card&gt;
              &lt;/motion.div&gt;
            )}
          &lt;/AnimatePresence&gt;
        );
      }