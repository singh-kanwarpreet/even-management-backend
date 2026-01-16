const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },

    attended: {
      type: Boolean,
      default: false,
    },

    certificateSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);


const registerationModel = mongoose.model("Registration", registrationSchema);
module.exports = registerationModel;
