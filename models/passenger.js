var mongoose = require('mongoose')

// Define new schema
var PassengerSchema = new mongoose.Schema({
  userId: String,
  fname: {
    type: String,
    label: "First name",
  },
  lname: {
    type: String,
    maxLength: 100
  },
  email: {
    type: String,
    maxLength: 100
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unspecified']
  },
  status: {
    type: String,
    required: true,
    default: 'inactive',
    enum: ['blocked', 'inactive', 'notverified', 'active', 'deactivated']
  },
  dob: {
    type: Date
  },
  mobile: {
    type: String,
    maxLength: 12
  },
  country: {
    type: String,
    maxLength: 30
  },
  state: {
    type: String,
    maxLength: 30
  },
  city: {
    type: String,
    maxLength: 30
  },
  addressline1: {
    type: String,
    maxLength: 30
  },
  addressline2: {
    type: String,
    maxLength: 30
  },
  postal: {
    type: String,
    maxLength: 20
  },
  timestamps: {}
});


//Export the mongoose model
// this makes the class name Passenger available for us !
// this model class has the save/update methods available
module.exports = mongoose.model('Passenger', PassengerSchema)
