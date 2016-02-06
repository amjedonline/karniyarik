// Load the driver model
var Driver = require('../models/driver');

//Create endpoint /api/drivers for POSTS
exports.postDrivers = function(req, res){
  var driver = new Driver();

  //set the briver properties that come from the POST data
  driver.name = req.body.name;
  driver.type = req.body.type;
  driver.quantity = req.body.quantity;
  driver.userId = req.user._id;

  // Save the driver and check for errors
  driver.save(function(err){
    if (err)
      res.send(err);
    else
      res.json(driver);
  })
};

//get all
exports.getDrivers = function(req, res) {
  Driver.find({ userId: req.user._id },function(err, drivers){
    if(err)
      res.send(err);
    else
      res.json(drivers);
  })
};

//get one
exports.getDriver = function(req, res) {
  Driver.findById({ userId: req.user._id, _id: req.params.driver_id }, function(err, driver){
    if (err)
      res.send(err)
    else
      res.json(driver);
  });
};

exports.putDriver = function(req, res) {
  Driver.update({userId: req.user._id, _id: req.params.driver_id}, { quantity: req.body.quantity },
      function(err, num, raw) {
        if (err)
          res.send(err)
        else
          res.json({message: 'Updated the driver.'});
    });
};

exports.deleteDriver = function(req, res) {
  Driver.findByIdAndRemove(req.params.driver_id, function(err, driver){
    if (err)
      res.send(err)
    else
      res.json({ message: 'Driver removed from the locker!' });
  });
};
