const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let numbers = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/api/persons', (request,response) => {
    response.json(numbers)
})

app.get('/info', (request, response) => {
    let date = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const offset = date.getTimezoneOffset()
    const offsethours = Math.floor((Math.abs(offset)/60)).toString() 
    const offsetminutes = (Math.abs(offset)%60).toString()
    const offsettime = offsethours < 10 ? '0' + offsethours + offsetminutes : offsethours + offsetminutes
    const sign = offset>0 ? '-' : '+'
    const timezonename = date.toLocaleDateString(undefined, {day:'2-digit',timeZoneName: 'long' }).substring(4)
    response.send(`<p>Phonebook has info for ${numbers.length} people</p>
    <p>${days[date.getDay()]} ${months[date.getMonth()]}  ${date.getDate()} ${date.getFullYear()} ${date.toLocaleTimeString('en-GB')} GMT${sign}${offsettime} (${timezonename})</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = numbers.find(person => person.id == id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  if (numbers.some(number => number.id == id)) {
    numbers = numbers.filter(number => number.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * 500)
  const person = request.body
  if (!person.name) {
    return response.status(404).json({
      error: 'Cannot save contact without a name'
    })
  }
  if (!person.number) {
    return response.status(404).json({
      error: 'Cannot save contact without a number'
    })
  }
  if (numbers.some(number => number.name === person.name)) {
    return response.status(404).json({
      error: 'There is already a contact existed with the same name'
    })
  }
    person.id = id
    numbers = numbers.concat(person)
    response.json(numbers)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
