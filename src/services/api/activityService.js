import activityData from '../mockData/activities.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let activities = [...activityData]

const activityService = {
  async getAll() {
    await delay(300)
    return [...activities]
  },

  async getById(id) {
    await delay(200)
    const activity = activities.find(a => a.id === id)
    return activity ? {...activity} : null
  },

  async getByTripId(tripId) {
    await delay(250)
    return activities
      .filter(a => a.tripId === tripId)
      .map(activity => ({...activity}))
  },

  async getByDayId(dayId) {
    await delay(250)
    return activities
      .filter(a => a.dayId === dayId)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map(activity => ({...activity}))
  },

  async create(activityData) {
    await delay(400)
    const newActivity = {
      id: Date.now().toString(),
      ...activityData
    }
    activities.push(newActivity)
    
    // Also update the itinerary day
    const { default: itineraryDayService } = await import('./itineraryDayService.js')
    const day = await itineraryDayService.getById(activityData.dayId)
    if (day) {
      const updatedActivities = [...(day.activities || []), newActivity]
      await itineraryDayService.update(day.id, { activities: updatedActivities })
    }
    
    return {...newActivity}
  },

  async update(id, updates) {
    await delay(300)
    const index = activities.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Activity not found')
    
    activities[index] = {
      ...activities[index],
      ...updates
    }
    return {...activities[index]}
  },

  async delete(id) {
    await delay(250)
    const index = activities.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Activity not found')
    
    const deleted = activities.splice(index, 1)[0]
    return {...deleted}
  }
}

export default activityService