import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    basic_info: {
      name: { type: String, required: true },
      password: { type: String,required:true },
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
    security: {
      authentication_methods: [
        {
          type: {
            type: String,
            enum: ["google", "facebook", "email"],
          },
          external_id: { type: String },
        },
      ],
      emergency_contact: {
        name: String,
        phone: String,
        relationship: { type: String, enum: ["family", "friend"] },
      },
    },
    ride_preferences: {
      favorite_drivers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "drivers" },
      ],
      preferred_vehicles: [
        { type: String, enum: ["sedan", "suv", "motorcycle"] },
      ],
      default_configuration: {
        air_conditioning: { type: Boolean, default: false },
        music: { type: Boolean, default: false },
        conversation: { type: Boolean, default: false },
      },
    },
    location: {
      current: {
        coordinates: {
          lat: { type: Number },
          lng: { type: Number },
        },
        last_updated: { type: Date, default: Date.now },
      },
      frequent_places: [
        {
          alias: { type: String, enum: ["home", "work"] },
          coordinates: {
            lat: { type: Number },
            lng: { type: Number },
          },
          geofence_radius: Number,
        },
      ],
    },
    reservations: {
      automatic: [
        {
          alias: String,
          destination: {
            lat: { type: Number },
            lng: { type: Number },
          },
          schedule: {
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
            departure_time: String,
            tolerance_minutes: Number,
          },
          configuration: {
            vehicle: { type: String, enum: ["sedan", "suv", "motorcycle"] },
            share_ride: Boolean,
          },
        },
      ],
      /*history: [
        {
          ride_id: { type: Schema.Types.ObjectId, ref: "Ride" },
          date: { type: Date, default: Date.now },
          rating: { type: Number, min: 1, max: 5 },
          used_route: { type: Schema.Types.ObjectId, ref: "Route" },
        },
      ],*/
    },
    reminders: {
      scheduled_rides: [
        {
          destination: {
            lat: { type: Number },
            lng: { type: Number },
          },
          date_time: { type: Date },
          notify_minutes_before: { type: Number, default: 30 },
          status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
          },
        },
      ],
      /* pending_payments: [
        {
          ride_id: { type: Schema.Types.ObjectId, ref: "Ride" },
          amount: { type: Number, required: true },
          due_date: { type: Date, required: true },
        },
      ],*/
    },
    settings: {
      notifications: {
        ride: {
          sms: { type: Boolean, default: true },
          push: { type: Boolean, default: true },
        },
        promotions: {
          email: { type: Boolean, default: false },
        },
      },
      privacy: {
        share_location: {
          type: String,
          enum: ["only_while_riding", "never"],
          default: "only_while_riding",
        },
      },
    },
    statistics: {
      monthly_rides: {
        total: { type: Number, default: 0 },
        average_rating: { type: Number, min: 1, max: 5 },
      },
      night_preferences: {
        night_vehicles: [
          { type: String, enum: ["sedan", "suv", "motorcycle"] },
        ],
        common_schedule: String,
      },
    },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

export default mongoose.model("users", UserSchema);
