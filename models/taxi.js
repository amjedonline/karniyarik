var mongoose = require('mongoose')

// Define new schema
var TaxiSchema = new mongoose.Schema({
  number: {
    type: String,
    max: 20,
    unique: true
  },
  manufacturer: {
    type: String,
    enum: ['Audi', 'Mercedes', 'Volkswagen', 'BMW', 'Toyota', 'Citron', 'Suzuki', 'Renault'],
  },
  model: {
    type: String,
    max: 100
  },
  bodyStyle: {
    type: String,
    enum: ['Convertibles', 'Coupe', 'Hatchbacks', 'Vans', 'Sedans', 'Suvs', 'Trucks', 'Wagons'],
    required: false
  },
  power: {
    type: Number,
    required: false
  },
  colour: {
    type: String,
    required: false
  },
  capacity: {
    type: Number,
    required: false
  },
  maximumLuggage: {
    type: Number,
    required: false
  },
  motorExpiry: {
    type: Date,
    required: false
  },
  insuranceNumber: {
    type: String,
    required: false
  },
  insuranceExpiryDate: {
    type: Date,
    required: false
  },
  pcoLicenseNumber: {
    type: String,
    required: false
  },
  pcoLicenseExpiryDate: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Blocked']
  },
  createdBy: {
    type: String
  }
  /*
  location : [{
    "type":{
      type: String,
      enum: ["Point"]
    },
    "coordinates":[{
      lat: {type: Number, min: -180, max: 180},
      lng: {type: Number, min: -90, max: 90}
    }]
  }], */

});

// Export the Mongoose model
module.exports = mongoose.model('Taxi', TaxiSchema)
