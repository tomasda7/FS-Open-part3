const mongoose = require('mongoose');

if(process.argv.length < 3) {
    console.log('Give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url =
`mongodb+srv://tomasda7:${password}@open.8iruedz.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
});

if(process.argv.length === 3) {
    Person.find({}).then(people => {
        console.log("Phone book:");
        people.forEach(person => console.log(person.name, person.number));
        mongoose.connection.close()
    });
}
else if(process.argv.length === 5) {
    person.save().then(result => {
        console.log(`Added ${person.name} ${person.number} to phone book`);
        mongoose.connection.close()
    });
}

