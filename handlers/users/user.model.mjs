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

export const User = mongoose.model("users", schema);
