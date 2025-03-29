const mongoose = require('mongoose');

const VesselSchema = new mongoose.Schema({
  name:
  {
    type: String,
    required: true,
    unique: true,
  },

  latitude:
  {
    type: Number,
    required: true,
  },

  longitude:
  {
    type: Number,
    required: true,
  },
});

const Vessel = mongoose.model('Vessel', VesselSchema);

module.exports = Vessel;
