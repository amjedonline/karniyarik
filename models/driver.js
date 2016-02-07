var mongoose = require('mongoose')

// Define new schema
var DriverSchema = new mongoose.Schema({
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
  dob: {
    type: Date
  },
  mobile: {
    type: String,
    maxLength: 12
  },
  licensenumber: {
    type: String,
    maxLength: 20
  },
  licenseexpirydate: {
    type: Date
  },
  insurancenumber: {
    type: String,
    maxLength: 20
  },
  insuranceexpirydate: {
    type: Date
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
// this makes the class name Driver available for us !
// this model class has the save/update methods available
module.exports = mongoose. model('Driver', DriverSchema)
