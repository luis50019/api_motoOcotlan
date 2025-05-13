import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    participants: {
      driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "drivers",
        required: true,
      },
      passenger_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    },
    content: {
      comment: { type: String, required: true },
      rating: {
        overall: { type: Number, min: 1, max: 5, required: true },
        categories: {
          punctuality: { type: Number, min: 1, max: 5 },
          vehicle: { type: Number, min: 1, max: 5 },
          driving: { type: Number, min: 1, max: 5 },
        },
        
      },
      photos: [{ type: String }], // Array of image URLs
    },
    metadata: {
      date: { type: Date, default: Date.now },
      device: {
        type: { type: String, enum: ["Android", "iOS", "Web"] },
        app_version: { type: String, },
      },
      location: {
        coordinates: {
          lat: { type: Number },
          lng: { type: Number },
        },
        accuracy: { type: Number }, // meters
      },
    },
    visibility: {
      public: { type: Boolean, default: true },
      hide_name: { type: Boolean, default: false },
    },
    analytics: {
      sentiment: { type: String, enum: ["positive", "neutral", "negative"] },
      keywords: [{ type: String }],
    },
  },
  {
    timestamps: true,
    collection: "reviews",
  }
);

export default mongoose.model("reviews", ReviewSchema);
