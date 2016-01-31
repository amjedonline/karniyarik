var mongoose = require('mongoose')

// Define new schema
var BeerSchema = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number
});

//Export the mongoose model
// this makes the class name Beer available for us !
// this model class has the save/update methods available
module.exports = mongoose. model('Beer', BeerSchema)
