import Joi from "joi";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;


export const UserJoiRegister = Joi.object({
  name: Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().optional(),
    lastName: Joi.string().required(),
  }).required(),

  phone: Joi.string().required().regex(phoneRegex),
  email: Joi.string().required().regex(emailRegex),
  password: Joi.string().required().regex(passwordRegex),

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

  isAdmin: Joi.boolean(),
  isBusiness: Joi.boolean(),
});

export const UserJoiLogin = Joi.object({
  email: Joi.string().required().regex(emailRegex),
  password: Joi.string().required().regex(passwordRegex),
})
