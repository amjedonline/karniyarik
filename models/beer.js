var mongoose = require('mongoose')

// Define new schema
var BeerSchema = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number
});

//Export the mongoose model
module.exports = mongoose. model('Beer', BeerSchema)
