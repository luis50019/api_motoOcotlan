import mongoose from "mongoose";

const PlaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      type: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      required: true,
      index: "2dsphere", // Geospatial index
    },
    type: {
      type: String,
      enum: ["business", "residence", "landmark", "other"],
      default: "residence",
    },
    serviceRadius: {
      // In meters
      type: Number,
      default: 500,
    },
    zone: {
      type: String,
      enum: ["north", "south", "east", "west", "central", "metro_area"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    operatingHours: {
      // Optional for businesses
      days: [
        {
          type: String,
          enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
      ],
      openingTime: String, // "HH:MM" format
      closingTime: String, // "HH:MM" format
    },
    createdBy: {
      // Reference to user/admin who created it
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

export default mongoose.model("places", PlaceSchema);
