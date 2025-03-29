const Vessel = require('../models/Vessel');


// route GET /api/vessels/:name
const getVesselByName = async (req, res) => 
{

  try 
  {
    const vessel = await Vessel.findOne({ name: req.params.name });


    if (!vessel) 
    {
      return res.status(404).json({ msg: 'Vessel not found' });
    }

    res.json(vessel);
  }

  catch (err) 
  {
    res.status(500).json({ msg: 'Server Error' });
  }
};

const getVessels = async (req, res) => 
{

  try 
  {
    const vessels = await Vessel.find();  // Find all vessels from the database
    res.json(vessels);  // Respond with all vessels in JSON format
  }

  catch (err) 
  {
    res.status(500).json({ msg: 'Server Error' });
  }
};


// route POST /api/vessels
const addVessel = async (req, res) =>
{
  const { name, latitude, longitude } = req.body;

  // Check if coordinates are within valid ranges
  if (
    latitude < -90 || latitude > 90 ||
    longitude < -180 || longitude > 180
  )
  {
    return res.status(400).json({ msg: 'Invalid latitude or longitude values' });
  }

  try
  {
    let vessel = new Vessel({
      name,
      latitude,
      longitude,
    });

    await vessel.save();
    res.status(201).json(vessel);
  } catch (err)
  {
    res.status(500).json({ msg: 'Server Error' });
  }
};



// route PUT /api/vessels/:name
const updateVesselByName = async (req, res) =>
{
  const { name, latitude, longitude } = req.body;

  // Check if coordinates are within valid ranges of googlemaps
  if (
    (latitude !== undefined && (latitude < -90 || latitude > 90)) ||
    (longitude !== undefined && (longitude < -180 || longitude > 180))
  )
  {
    return res.status(400).json({ msg: 'Invalid latitude or longitude values' });
  }


  try
  {
    let vessel = await Vessel.findOne({ name: req.params.name });

    if (!vessel)
    {
      return res.status(404).json({ msg: 'Vessel not found' });
    }

    vessel.name = name || vessel.name;
    vessel.latitude = latitude !== undefined ? latitude : vessel.latitude;
    vessel.longitude = longitude !== undefined ? longitude : vessel.longitude;

    await vessel.save();
    res.json(vessel);
  } catch (err)
  {
    res.status(500).json({ msg: 'Server Error' });
  }
};



// route DELETE /api/vessels/:name
const deleteVesselByName = async (req, res) => 
{

  try 
  {
    // Find the vessel by name
    const vessel = await Vessel.findOne({ name: req.params.name });

    //404 error if vessel not found
    if (!vessel) 
    {
      return res.status(404).json({ msg: 'Vessel not found' });
    }

    await Vessel.deleteOne({ name: req.params.name });

    res.json({ msg: 'Vessel removed' });
  }

  catch (err) 
  {
    res.status(500).json({ msg: 'Server Error' });
  }
};



module.exports = { getVesselByName, addVessel, updateVesselByName, deleteVesselByName, getVessels };
