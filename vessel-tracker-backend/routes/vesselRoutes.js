const express = require('express');
const router = express.Router();
const
  {
    getVessels,
    getVesselByName,
    addVessel,
    updateVesselByName,
    deleteVesselByName,
  } = require('../controllers/vesselController');

// Routes
router.get('/', getVessels);
router.get('/:name', getVesselByName);
router.post('/', addVessel);
router.put('/:name', updateVesselByName);
router.delete('/:name', deleteVesselByName);

module.exports = router;
