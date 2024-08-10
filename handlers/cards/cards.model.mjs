import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
  url: { type: String, required: false },
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
  email: { type: String, required: true },
  image: imageSchema,
  address: addressSchema,
  likes: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true, // Указание на обязательность этого поля
    ref: "User", // Ссылка на модель User для связи с пользователем
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export const Card = mongoose.model("Card", schemaCards);
