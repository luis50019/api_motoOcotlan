import mongoose from "mongoose";

// Sub-schema for customized pricing
const CustomPricingSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // Format: "HH:MM"
  endTime: { type: String, required: true }, // Format: "HH:MM"
  price: { type: Number, required: true },
  applicableDays: {
    type: [String],
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

// Sub-schema for stop pricing
const StopPricingSchema = new mongoose.Schema({
  pricePerStop: { type: Number, required: true },
  maxStopsAllowed: { type: Number, default: 5 },
  isActive: { type: Boolean, default: true },
});

// Main pricing model schema
const PricingModelSchema = new mongoose.Schema(
  {
    pricingType: {
      global: {
        price: { type: Number },
        isActive: { type: Boolean, default: false },
      },
      customized: [CustomPricingSchema],
    },
    stopPricing: StopPricingSchema,
    acceptedPaymentMethods: {
      type: [String],
      enum: ["cash", "card", "mobile_payment"],
      default: ["cash"],
    },
    distanceMin: { type: Number, required: true },
    distanceMax: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("rates", PricingModelSchema);
