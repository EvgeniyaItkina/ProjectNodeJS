import mongoose, { Schema } from "mongoose"

const nameSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String, required: true },
})

const imageSchema = new Schema({
  url: String,
  alt: String,
})

const addressSchema = new Schema({
  state: String,
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  houseNumber: { type: String, required: true },
  zip: Number,
});
const schema = new Schema({
  name: { type: nameSchema, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: imageSchema,
  address: addressSchema,
  isAdmin: { type: Boolean, default: false },
  isBusiness: { type: Boolean, default: false },
}, {
  //temp files 
  timestamps: true,
});

// Define the schema for storing session information
const sessionSchema = new Schema({
  // The userID field stores a reference to the User model, linking each session to a specific user
  userID: { type: mongoose.ObjectId, ref: 'User' },
  failedAttempts: { type: Number, default: 0 },
  lastFailedAttempt: { type: Date }
}, {
  // Automatically add createdAt and updatedAt fields to track when the session was created and last updated
  timestamps: true
});


// Create a Mongoose model for the session schema
export const Session = mongoose.model("Session", sessionSchema);
export const User = mongoose.model("users", schema);
