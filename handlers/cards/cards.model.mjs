import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
  url: { type: String, required: true },
  alt: String,
});

const addressSchema = new Schema({
  state: String,
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  houseNumber: { type: Number, required: true },
  zip: Number,
});

const schemaCards = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: imageSchema,
  address: addressSchema,
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export const Card = mongoose.model("Card", schemaCards);
