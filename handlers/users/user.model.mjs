import mongoose, { Schema } from "mongoose"

const nameSchema = new Schema({
  firstName: String,
  middleName: String,
  lastName: String,
})

const imageSchema = new Schema({
  url: String,
  alt: String,
})

const adressSchema = new Schema({
  state: String,
  country: String,
  city: String,
  street: String,
  houseNumber: Number,
  zip: Number,
});
const schema = new Schema({
  name: nameSchema,
  phone: String,
  email: String,
  password: String,
  image: imageSchema,
  adress: adressSchema,
  isAdmin: Boolean,
  isBusiness: Boolean,
});

export const User = mongoose.model("users", schema);
