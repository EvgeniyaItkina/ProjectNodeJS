import Joi from "joi";

const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const CardJoi = Joi.object({
  title: Joi.string().required(),
  subtitle: Joi.string().required(),
  description: Joi.string().required(),
  phone: Joi.string().required().regex(phoneRegex),
  email: Joi.string().required().regex(emailRegex),

  address: Joi.object({
    state: Joi.string().optional(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.string().required(),
    zip: Joi.number().optional(),
  }).required(),

  image: Joi.object({
    url: Joi.string().uri().optional(),
    alt: Joi.string().optional(),
  }).optional(),

  likes: Joi.array().items(Joi.string().hex().length(24)).default([]),

  user_id: Joi.string().hex().length(24).required(),
})