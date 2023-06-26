require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const person = require('./models/person');

const app = express();

morgan.token('body', (request) => { return JSON.stringify(request.body) });

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint." })
}

app.use(morgan(':method :url :status :response-time ms - :body'));
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

let persons = [
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
  },
  {
    "id": 5,
    "name": "Alan Turing",
    "number": "4442231"
  },
]

app.get('/info', (request, response) => {
  let date = new Date();

  response.send(
  `<h3>
  the phone book has information about ${persons.length} persons <br/>
  ${date}
  <h3>`
  );
});

app.get('/api/persons', (request, response) => {
  Person.find({})
  .then(people =>
    response.json(people)
  )
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
  .then(person => {
    response.json(person)
  })
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.sendStatus(204);
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if(!name || !number) {
    return response.status(400).json({
      error: 'Mandatory data is missing.'
    })
  }

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(newPerson => {
    response.status(201).json(newPerson);
  })
})

app.use(unknownEndpoint);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
