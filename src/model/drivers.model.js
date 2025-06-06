import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  basic_info: {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: {
      address: { type: String, lowercase: true, trim: true },
      verified: { type: Boolean, default: false },
    },
    phone: {
      number: { type: String, required: true },
      country_code: { type: String, default: "+52" },
      verified: { type: Boolean, default: false },
    },
    age: { type: Number, min: 18 },
    profile_picture: String,
    language_preference: { type: String, default: "es_MX" },
  },
  state_driver: {
    type: String,
    enum: ["active", "inactive", "suspended"],
  },
  security: {
    license: {
      number: String,
      expiration: Date,
      photo_url: String,
    },
    vehicle_insurance: {
      number: String,
      validity: Date,
      coverage: String,
    },
    background_check: {
      status: { type: String, enum: ["approved", "pending", "rejected"] },
      verification_date: Date,
    },
    emergency_contact: {
      name: String,
      phone: String,
    },
  },
  rating: Number,
  types_comment:{
    exellentComments: Number,
    goodGrades: Number,
    neutralComments: Number,
    regularCommnets: Number,
    badComments: Number,
  },
  unit: {
    number: String,
    type: { type: String, enum: ["sedan", "SUV", "motorcycle"] },
    luggage_capacity: String,
    passenger_limit: Number,
    status: { type: String, enum: ["empty", "in_transit", "maintenance"] },
  },
  profile_photo: String,
  performance: {
    total_trips: Number,
    total_earnings: Number,
    canceled_trips: Number,
    completed_trips: Number,
    average_response_time: Number, // minutes
    acceptance_rate: { type: Number, min: 0, max: 100 },
    historical_availability: { type: Number, min: 0, max: 100 },
  },
  operation: {
    schedules: [
      {
        day: String,
        start: Date,
        end: Date,
        mode: { type: String, enum: ["fixed_hours", "until_earned_amount"] },
      },
    ],
    active_zones: [String],
    rates: {
      base: Number,
      per_km: Number,
      per_minute: Number,
    },
  },
  location: {
    coordinates: {
      lat: Number,
      lng: Number,
    },
    last_updated: Date,
    accuracy: Number, // meters
    history: [
      {
        coordinates: {
          lat: Number,
          lng: Number,
        },
        timestamp: Date,
      },
    ],
  },
  preferences: {
    tags: [String],
    ride_mode: { type: String, enum: ["silent", "standard"] },
  },
  reminders: [
    {
      type: { type: String, enum: ["maintenance", "documentation"] },
      title: String,
      date: Date,
      completed: Boolean,
    },
  ],
  device: {
    last_connection: Date,
    operating_system: String,
    app_version: String,
  },
});

export default mongoose.model("drivers", driverSchema);
