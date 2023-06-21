const express = require('express');
const app = express();

const persons = [
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
    response.json(persons)
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if(person) {
        response.json(person);
    } else {
        response.status(404).send('<h3>Person not found.<h3>')
    }
});




const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
