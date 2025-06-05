import { useEffect, useState } from 'react';
      import { motion } from 'framer-motion';
      import { toast } from 'react-toastify';
      import ApperIcon from '../atoms/ApperIcon';
      import Button from '../atoms/Button';
      import Text from '../atoms/Text';
      import StatCard from '../molecules/StatCard';
      import BudgetProgress from '../molecules/BudgetProgress';
      import Card from '../molecules/Card';
      import ExpenseCard from '../molecules/ExpenseCard';
      import AddExpenseModal from './AddExpenseModal';
      import { expenseService } from '../../services';
      
      export default function BudgetSection({ selectedTrip }) {
        const [expenses, setExpenses] = useState([]);
        const [loading, setLoading] = useState(false);
        const [showExpenseModal, setShowExpenseModal] = useState(false);
      
        useEffect(() =&gt; {
          if (selectedTrip) {
            loadExpenses();
          }
        }, [selectedTrip]);
      
        const loadExpenses = async () =&gt; {
          if (!selectedTrip) return;
          
          setLoading(true);
          try {
            const tripExpenses = await expenseService.getByTripId(selectedTrip.id);
            setExpenses(tripExpenses || []);
          } catch (error) {
            toast.error('Failed to load expenses');
          } finally {
            setLoading(false);
          }
        };
      
        if (!selectedTrip) {
          return (
            &lt;div className="text-center py-16"&gt;
              &lt;ApperIcon name="DollarSign" className="w-16 h-16 text-gray-400 mx-auto mb-4" /&gt;
              &lt;Text as="h3" className="text-xl font-heading font-semibold text-gray-600 mb-2"&gt;
                Select a Trip
              &lt;/Text&gt;
              &lt;Text className="text-gray-500"&gt;Choose a trip to view and manage its budget&lt;/Text&gt;
            &lt;/div&gt;
          );
        }
      
        const categories = ['food', 'transport', 'accommodation', 'activities', 'shopping'];
        const expensesByCategory = categories.reduce((acc, category) =&gt; {
          acc[category] = expenses.filter(exp =&gt; exp.category === category)
            .reduce((sum, exp) =&gt; sum + exp.amount, 0)
          return acc;
        }, {});
      
        const totalSpent = Object.values(expensesByCategory).reduce((sum, amount) =&gt; sum + amount, 0);
        const remainingBudget = selectedTrip.budget - totalSpent;
      
        return (
          &lt;div className="space-y-6"&gt;
            &lt;div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"&gt;
              &lt;div&gt;
                &lt;Text as="h1" className="text-3xl font-heading font-bold text-gray-800"&gt;
                  Budget Tracker
                &lt;/Text&gt;
                &lt;Text className="text-gray-600"&gt;{selectedTrip.name}&lt;/Text&gt;
              &lt;/div&gt;
              &lt;Button
                onClick={() =&gt; setShowExpenseModal(true)}
                className="px-6 py-3 bg-accent text-white hover:bg-amber-600"
                icon="Plus"
              &gt;
                Add Expense
              &lt;/Button&gt;
            &lt;/div&gt;
      
            &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-6"&gt;
              &lt;StatCard 
                title="Total Budget" 
                value={selectedTrip.budget} 
                currency={selectedTrip.currency} 
                className="text-primary" 
              /&gt;
              &lt;StatCard 
                title="Spent" 
                value={totalSpent} 
                currency={selectedTrip.currency} 
                className="text-secondary" 
                delay={0.1}
              /&gt;
              &lt;StatCard 
                title="Remaining" 
                value={remainingBudget} 
                currency={selectedTrip.currency} 
                className={remainingBudget &gt;= 0 ? 'text-secondary' : 'text-red-500'} 
                delay={0.2}
              /&gt;
            &lt;/div&gt;
      
            {selectedTrip.budget &gt; 0 && (
              &lt;BudgetProgress totalBudget={selectedTrip.budget} totalSpent={totalSpent} /&gt;
            )}
      
            &lt;Card 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            &gt;
              &lt;Text as="h3" className="text-lg font-semibold text-gray-800 mb-6"&gt;Expenses by Category&lt;/Text&gt;
              &lt;div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"&gt;
                {categories.map((category) =&gt; (
                  &lt;div key={category} className="text-center"&gt;
                    &lt;div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full flex items-center justify-center mb-3"&gt;
                      &lt;ApperIcon 
                        name={
                          category === 'food' ? 'Utensils' :
                          category === 'transport' ? 'Car' :
                          category === 'accommodation' ? 'Bed' :
                          category === 'activities' ? 'Camera' : 'ShoppingBag'
                        } 
                        className="w-8 h-8 text-primary" 
                      /&gt;
                    &lt;/div&gt;
                    &lt;Text as="h4" className="font-medium text-gray-800 capitalize mb-1"&gt;{category}&lt;/Text&gt;
                    &lt;Text className="text-sm font-semibold text-secondary"&gt;
                      {selectedTrip.currency} {expensesByCategory[category].toLocaleString()}
                    &lt;/Text&gt;
                  &lt;/div&gt;
                ))}
              &lt;/div&gt;
            &lt;/Card&gt;
      
            {expenses.length &gt; 0 && (
              &lt;Card 
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              &gt;
                &lt;Text as="h3" className="text-lg font-semibold text-gray-800 mb-6"&gt;Recent Expenses&lt;/Text&gt;
                &lt;div className="space-y-3"&gt;
                  {expenses.slice(0, 5).map((expense) =&gt; (
                    &lt;ExpenseCard key={expense.id} expense={expense} currency={selectedTrip.currency} /&gt;
                  ))}
                &lt;/div&gt;
              &lt;/Card&gt;
            )}
      
            &lt;AddExpenseModal 
              show={showExpenseModal} 
              onClose={() =&gt; setShowExpenseModal(false)} 
              selectedTripId={selectedTrip?.id}
              onExpenseAdded={loadExpenses}
            /&gt;
          &lt;/div&gt;
        );
      }