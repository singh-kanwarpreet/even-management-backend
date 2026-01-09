const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

organizerSchema.index({ organizationName: 1, managedBy: 1 }, { unique: true });

const organizerModel = mongoose.model("Organizer", organizerSchema);

module.exports = organizerModel;
