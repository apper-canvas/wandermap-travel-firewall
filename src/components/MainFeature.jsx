import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, parseISO, addDays } from 'date-fns'
import ApperIcon from './ApperIcon'
import { tripService, itineraryDayService, activityService, expenseService } from '../services'

export default function MainFeature({ trips, selectedTrip, activeView, onTripsUpdate, onTripSelect }) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [itineraryDays, setItineraryDays] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [newTrip, setNewTrip] = useState({
    name: '',
    startDate: '',
    endDate: '',
    destination: '',
    coverImage: '',
    budget: '',
    currency: 'USD'
  })
  const [newActivity, setNewActivity] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    notes: '',
    category: 'sightseeing',
    dayId: ''
  })
  const [newExpense, setNewExpense] = useState({
    category: 'food',
    amount: '',
    description: '',
    date: ''
  })

  // Load itinerary days when selected trip changes
  useEffect(() => {
    if (selectedTrip && activeView === 'itinerary') {
      loadItineraryDays()
    }
  }, [selectedTrip, activeView])

  // Load expenses when selected trip changes
  useEffect(() => {
    if (selectedTrip && activeView === 'budget') {
      loadExpenses()
    }
  }, [selectedTrip, activeView])

  const loadItineraryDays = async () => {
    if (!selectedTrip) return
    
    setLoading(true)
    try {
      const days = await itineraryDayService.getByTripId(selectedTrip.id)
      setItineraryDays(days || [])
    } catch (error) {
      toast.error('Failed to load itinerary')
    } finally {
      setLoading(false)
    }
  }

  const loadExpenses = async () => {
    if (!selectedTrip) return
    
    setLoading(true)
    try {
      const tripExpenses = await expenseService.getByTripId(selectedTrip.id)
      setExpenses(tripExpenses || [])
    } catch (error) {
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = async (e) => {
    e.preventDefault()
    if (!newTrip.name || !newTrip.startDate || !newTrip.endDate || !newTrip.destination) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const tripData = {
        ...newTrip,
        budget: parseFloat(newTrip.budget) || 0,
        coverImage: newTrip.coverImage || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
      }
      
      const createdTrip = await tripService.create(tripData)
      const updatedTrips = await tripService.getAll()
      onTripsUpdate(updatedTrips)
      onTripSelect(createdTrip)
      
      // Create initial itinerary days
      const startDate = parseISO(newTrip.startDate)
      const endDate = parseISO(newTrip.endDate)
      const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      
      for (let i = 0; i < dayCount; i++) {
        await itineraryDayService.create({
          tripId: createdTrip.id,
          date: format(addDays(startDate, i), 'yyyy-MM-dd'),
          dayNumber: i + 1,
          activities: []
        })
      }
      
      setNewTrip({
        name: '',
        startDate: '',
        endDate: '',
        destination: '',
        coverImage: '',
        budget: '',
        currency: 'USD'
      })
      setShowCreateModal(false)
      toast.success('Trip created successfully!')
    } catch (error) {
      toast.error('Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return

    try {
      await tripService.delete(tripId)
      const updatedTrips = await tripService.getAll()
      onTripsUpdate(updatedTrips)
      
      if (selectedTrip?.id === tripId) {
        onTripSelect(updatedTrips[0] || null)
      }
      
      toast.success('Trip deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete trip')
    }
  }

  const handleAddActivity = async (e) => {
    e.preventDefault()
    if (!newActivity.title || !newActivity.startTime || !newActivity.dayId) {
      toast.error('Please fill in required fields')
      return
    }

    try {
      await activityService.create({
        ...newActivity,
        tripId: selectedTrip.id,
        coordinates: { lat: 0, lng: 0 } // Placeholder coordinates
      })
      
      await loadItineraryDays()
      setNewActivity({
        title: '',
        startTime: '',
        endTime: '',
        location: '',
        notes: '',
        category: 'sightseeing',
        dayId: ''
      })
      setShowActivityModal(false)
      toast.success('Activity added successfully!')
    } catch (error) {
      toast.error('Failed to add activity')
    }
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    if (!newExpense.amount || !newExpense.description || !newExpense.date) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await expenseService.create({
        ...newExpense,
        tripId: selectedTrip.id,
        amount: parseFloat(newExpense.amount)
      })
      
      await loadExpenses()
      setNewExpense({
        category: 'food',
        amount: '',
        description: '',
        date: ''
      })
      setShowExpenseModal(false)
      toast.success('Expense added successfully!')
    } catch (error) {
      toast.error('Failed to add expense')
    }
  }

  const renderDashboard = () => (
    <div className="space-y-8">
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-800">
            Your Adventures
          </h1>
          <p className="text-gray-600 mt-2">Plan, organize, and track your journeys</p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lift transform hover:scale-105 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span className="font-medium">New Trip</span>
        </motion.button>
      </motion.div>

      {trips.length === 0 ? (
        <motion.div 
          className="text-center py-16 px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full flex items-center justify-center mb-8">
            <ApperIcon name="MapPin" className="w-16 h-16 text-primary" />
          </div>
          <h3 className="text-2xl font-heading font-semibold text-gray-800 mb-4">
            Start Your Journey
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Create your first trip and begin planning an unforgettable adventure. 
            Organize itineraries, track expenses, and make memories.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-medium rounded-xl hover:shadow-lift transform hover:scale-105 transition-all duration-300"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Plan Your First Trip</span>
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              className="trip-card glass-card rounded-2xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onTripSelect(trip)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={trip.coverImage} 
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTrip(trip.id)
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-heading font-bold text-lg">{trip.name}</h3>
                  <p className="text-sm opacity-90">{trip.destination}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{format(parseISO(trip.startDate), 'MMM dd')}</span>
                  <span>-</span>
                  <span>{format(parseISO(trip.endDate), 'MMM dd, yyyy')}</span>
                </div>
                {trip.budget > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget</span>
                    <span className="font-semibold text-secondary">
                      {trip.currency} {trip.budget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )

  const renderItinerary = () => {
    if (!selectedTrip) {
      return (
        <div className="text-center py-16">
          <ApperIcon name="Calendar" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-semibold text-gray-600 mb-2">
            Select a Trip
          </h3>
          <p className="text-gray-500">Choose a trip to view and edit its itinerary</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-800">
              {selectedTrip.name} Itinerary
            </h1>
            <p className="text-gray-600">{selectedTrip.destination}</p>
          </div>
          <button
            onClick={() => setShowActivityModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-colors"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Add Activity</span>
          </button>
        </div>

        <div className="space-y-6">
          {itineraryDays.map((day, index) => (
            <motion.div
              key={day.id}
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">
                Day {day.dayNumber} - {format(parseISO(day.date), 'EEEE, MMMM dd')}
              </h3>
              
              {day.activities?.length > 0 ? (
                <div className="space-y-3">
                  {day.activities.map((activity) => (
                    <div key={activity.id} className="timeline-item pl-6 pb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <ApperIcon name="Clock" className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                            <span className="text-sm text-gray-500">
                              {activity.startTime}
                              {activity.endTime && ` - ${activity.endTime}`}
                            </span>
                          </div>
                          {activity.location && (
                            <p className="text-sm text-gray-600 mb-1">
                              <ApperIcon name="MapPin" className="w-4 h-4 inline mr-1" />
                              {activity.location}
                            </p>
                          )}
                          {activity.notes && (
                            <p className="text-sm text-gray-600">{activity.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No activities planned for this day</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const renderMap = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-gray-800">
        Map View
      </h1>
      
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name="Map" className="w-16 h-16 text-blue-500" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">
          Interactive Map Coming Soon
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Visualize your trip destinations, view routes between locations, and explore points of interest on our interactive map.
        </p>
      </div>
    </div>
  )

  const renderBudget = () => {
    if (!selectedTrip) {
      return (
        <div className="text-center py-16">
          <ApperIcon name="DollarSign" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-semibold text-gray-600 mb-2">
            Select a Trip
          </h3>
          <p className="text-gray-500">Choose a trip to view and manage its budget</p>
        </div>
      )
    }

    const categories = ['food', 'transport', 'accommodation', 'activities', 'shopping']
    const expensesByCategory = categories.reduce((acc, category) => {
      acc[category] = expenses.filter(exp => exp.category === category)
        .reduce((sum, exp) => sum + exp.amount, 0)
      return acc
    }, {})

    const totalSpent = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0)
    const budgetProgress = selectedTrip.budget > 0 ? (totalSpent / selectedTrip.budget) * 100 : 0

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-800">
              Budget Tracker
            </h1>
            <p className="text-gray-600">{selectedTrip.name}</p>
          </div>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-amber-600 transition-colors"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Budget</h3>
            <p className="text-3xl font-bold text-primary">
              {selectedTrip.currency} {selectedTrip.budget.toLocaleString()}
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Spent</h3>
            <p className="text-3xl font-bold text-secondary">
              {selectedTrip.currency} {totalSpent.toLocaleString()}
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Remaining</h3>
            <p className={`text-3xl font-bold ${
              selectedTrip.budget - totalSpent >= 0 ? 'text-secondary' : 'text-red-500'
            }`}>
              {selectedTrip.currency} {(selectedTrip.budget - totalSpent).toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Budget Progress */}
        {selectedTrip.budget > 0 && (
          <motion.div 
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Budget Progress</h3>
              <span className="text-sm text-gray-600">{Math.round(budgetProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div 
                className={`budget-progress h-4 rounded-full ${
                  budgetProgress > 100 ? 'bg-red-500' : budgetProgress > 80 ? 'bg-amber-500' : 'bg-secondary'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Category Breakdown */}
        <motion.div 
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Expenses by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div key={category} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full flex items-center justify-center mb-3">
                  <ApperIcon 
                    name={
                      category === 'food' ? 'Utensils' :
                      category === 'transport' ? 'Car' :
                      category === 'accommodation' ? 'Bed' :
                      category === 'activities' ? 'Camera' : 'ShoppingBag'
                    } 
                    className="w-8 h-8 text-primary" 
                  />
                </div>
                <h4 className="font-medium text-gray-800 capitalize mb-1">{category}</h4>
                <p className="text-sm font-semibold text-secondary">
                  {selectedTrip.currency} {expensesByCategory[category].toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Expenses */}
        {expenses.length > 0 && (
          <motion.div 
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Expenses</h3>
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-800">{expense.description}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {expense.category} • {format(parseISO(expense.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {selectedTrip.currency} {expense.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  const getViewContent = () => {
    switch (activeView) {
      case 'dashboard': return renderDashboard()
      case 'itinerary': return renderItinerary()
      case 'map': return renderMap()
      case 'budget': return renderBudget()
      default: return renderDashboard()
    }
  }

  return (
    <div className="space-y-8">
      {getViewContent()}

      {/* Create Trip Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div 
              className="glass-card rounded-2xl p-8 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">Create New Trip</h2>
              
              <form onSubmit={handleCreateTrip} className="space-y-4">
                <input
                  type="text"
                  placeholder="Trip name"
                  value={newTrip.name}
                  onChange={(e) => setNewTrip({...newTrip, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                
                <input
                  type="text"
                  placeholder="Destination"
                  value={newTrip.destination}
                  onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={newTrip.startDate}
                    onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="date"
                    value={newTrip.endDate}
                    onChange={(e) => setNewTrip({...newTrip, endDate: e.target.value})}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Budget"
                    value={newTrip.budget}
                    onChange={(e) => setNewTrip({...newTrip, budget: e.target.value})}
                    className="col-span-2 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <select
                    value={newTrip.currency}
                    onChange={(e) => setNewTrip({...newTrip, currency: e.target.value})}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:shadow-lift transition-all disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Trip'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowActivityModal(false)}
          >
            <motion.div 
              className="glass-card rounded-2xl p-8 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">Add Activity</h2>
              
              <form onSubmit={handleAddActivity} className="space-y-4">
                <select
                  value={newActivity.dayId}
                  onChange={(e) => setNewActivity({...newActivity, dayId: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                >
                  <option value="">Select Day</option>
                  {itineraryDays.map((day) => (
                    <option key={day.id} value={day.id}>
                      Day {day.dayNumber} - {format(parseISO(day.date), 'MMM dd')}
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  placeholder="Activity title"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="time"
                    value={newActivity.startTime}
                    onChange={(e) => setNewActivity({...newActivity, startTime: e.target.value})}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                  <input
                    type="time"
                    value={newActivity.endTime}
                    onChange={(e) => setNewActivity({...newActivity, endTime: e.target.value})}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Location"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
                
                <select
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  <option value="sightseeing">Sightseeing</option>
                  <option value="food">Food & Dining</option>
                  <option value="transport">Transportation</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                </select>
                
                <textarea
                  placeholder="Notes (optional)"
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent"
                  rows="3"
                />

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowActivityModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-colors"
                  >
                    Add Activity
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showExpenseModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExpenseModal(false)}
          >
            <motion.div 
              className="glass-card rounded-2xl p-8 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">Add Expense</h2>
              
              <form onSubmit={handleAddExpense} className="space-y-4">
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="food">Food & Dining</option>
                  <option value="transport">Transportation</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="activities">Activities</option>
                  <option value="shopping">Shopping</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Amount"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
                
                <input
                  type="text"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />
                
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                />

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowExpenseModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-accent text-white rounded-xl hover:bg-amber-600 transition-colors"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}