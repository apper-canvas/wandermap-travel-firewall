import expenseData from '../mockData/expenses.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let expenses = [...expenseData]

const expenseService = {
  async getAll() {
    await delay(300)
    return [...expenses]
  },

  async getById(id) {
    await delay(200)
    const expense = expenses.find(e => e.id === id)
    return expense ? {...expense} : null
  },

  async getByTripId(tripId) {
    await delay(250)
    return expenses
      .filter(e => e.tripId === tripId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(expense => ({...expense}))
  },

  async create(expenseData) {
    await delay(400)
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData
    }
    expenses.push(newExpense)
    return {...newExpense}
  },

  async update(id, updates) {
    await delay(300)
    const index = expenses.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Expense not found')
    
    expenses[index] = {
      ...expenses[index],
      ...updates
    }
    return {...expenses[index]}
  },

  async delete(id) {
    await delay(250)
    const index = expenses.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Expense not found')
    
    const deleted = expenses.splice(index, 1)[0]
    return {...deleted}
  }
}

export default expenseService