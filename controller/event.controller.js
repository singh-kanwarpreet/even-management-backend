const Event = require("../models/Event");

const eventCreate = async (req, res) => {

  try {
    const {
      title,
      description,
      dateTime,
      endTime,
      location,
      mode,
      capacity,
      eligibilityRules, 
    } = req.body;

    const imageUrl = req.file ? req.file.path : undefined;

    const event = await Event.create({
      title,
      description,
      dateTime,
      endTime,
      location,
      mode,
      capacity,
      status: "UPCOMING",           
      organizerId: req.user._id,    
      eligibilityRules: eligibilityRules || { minAge: 0, maxAge: 100 },
      imageUrl,                     
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { eventCreate };
