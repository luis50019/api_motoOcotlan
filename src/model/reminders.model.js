import mongoose from "mongoose";

const RecurringRideConfigSchema = new Schema(
  {
    recurrence_config: {
      type: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "weekly",
        required: true,
      },
      days: [
        {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
      ],
      exclude_holidays: { type: Boolean, default: true },
    },
    schedule: {
      start_time: { type: String, required: true }, // Format: "HH:MM:SS±HH:MM"
      tolerance_window: { type: Number, min: 0, max: 60, default: 10 }, // minutes
    },
    locations: {
      origin: {
        activation_radius: { type: Number, default: 500 }, // meters
        address: { type: String, required: true },
      },
      destination: {
        address: { type: String, required: true },
      },
    },
    auto_config: {
      find_alternatives: { type: Boolean, default: true },
      max_attempts: { type: Number, min: 1, max: 5, default: 2 },
    },
  },
  {
    timestamps: true,
    collection: "recurring_ride_configs",
  },
);

export default mongoose.model("remiders", RecurringRideConfigSchema);
