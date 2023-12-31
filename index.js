require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', (request) => { return JSON.stringify(request.body) })

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint.' })
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :body'))


app.get('/info', async (request, response, next) => {
  try {
    const date = new Date()
    const numOfPersons = await Person.collection.estimatedDocumentCount()

    response.send(
      `<h3>
      the phone book has information about ${numOfPersons} persons <br/>
      ${date}
      <h3>`
    )
  } catch (error) { next(error) }
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people =>
      response.json(people)
    ).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if(!name || !number) {
    return response.status(400).json({
      error: 'Mandatory data is missing.'
    })
  }

  const person = new Person({
    name: name,
    number: number
  })

  person.save()
    .then(newPerson => {
      response.status(201).json(newPerson)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = {
    name: name,
    number: number
  }

  Person.findByIdAndUpdate(request.params.id, person,
    { new: true, runValidators: true, context: 'query' })
    .then(upatedPerson => {
      response.json(upatedPerson)
    }).catch(error => next(error))
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
