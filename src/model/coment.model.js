import mongoose from "mongoose";

const ReviewSchema = new Schema(
  {
    participants: {
      driver_id: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
      passenger_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      ride_id: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
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
        type: { type: String, enum: ["Android", "iOS", "Web"], required: true },
        app_version: { type: String, required: true },
      },
      location: {
        coordinates: {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
        accuracy: { type: Number }, // meters
      },
    },
    moderation: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      rejection_reason: { type: String },
      moderator_id: { type: Schema.Types.ObjectId, ref: "Moderator" },
      review_date: { type: Date },
    },
    response: {
      driver: {
        text: { type: String },
        date: { type: Date },
      },
      support: {
        text: { type: String },
        agent_id: { type: Schema.Types.ObjectId, ref: "SupportAgent" },
        date: { type: Date },
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
  },
);

export default mongoose.model("Review", ReviewSchema);
