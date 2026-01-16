const mongoose = require("mongoose");

const organizerReviewSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

const organizerReviewModel = mongoose.model(
  "OrganizerReview",
  organizerReviewSchema,
);

module.exports = organizerReviewModel;
