import itineraryData from '../mockData/itineraryDays.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let itineraryDays = [...itineraryData]

const itineraryDayService = {
  async getAll() {
    await delay(300)
    return [...itineraryDays]
  },

  async getById(id) {
    await delay(200)
    const day = itineraryDays.find(d => d.id === id)
    return day ? {...day} : null
  },

  async getByTripId(tripId) {
    await delay(250)
    return itineraryDays
      .filter(d => d.tripId === tripId)
      .sort((a, b) => a.dayNumber - b.dayNumber)
      .map(day => ({...day}))
  },

  async create(dayData) {
    await delay(400)
    const newDay = {
      id: Date.now().toString(),
      ...dayData,
      activities: dayData.activities || []
    }
    itineraryDays.push(newDay)
    return {...newDay}
  },

  async update(id, updates) {
    await delay(300)
    const index = itineraryDays.findIndex(d => d.id === id)
    if (index === -1) throw new Error('Itinerary day not found')
    
    itineraryDays[index] = {
      ...itineraryDays[index],
      ...updates
    }
    return {...itineraryDays[index]}
  },

  async delete(id) {
    await delay(250)
    const index = itineraryDays.findIndex(d => d.id === id)
    if (index === -1) throw new Error('Itinerary day not found')
    
    const deleted = itineraryDays.splice(index, 1)[0]
    return {...deleted}
  }
}

export default itineraryDayService