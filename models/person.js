require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.log('Error in connection with MongoDB: ', error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: [3, 'The name must contain at least 3 characters']
    },
    number: {
      type: String,
      minLength: [8, 'The phone number must contain at least 8 numbers'],
      validate: {
        validator: function(v) {
            return /^\d{2,3}-\d+$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number.`
      }
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

module.exports = mongoose.model('Person', personSchema)
