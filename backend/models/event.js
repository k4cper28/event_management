const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  availableTickets: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});



const Event = mongoose.model('Event', EventSchema);
module.exports = Event;

const validate = (data) => {
    const schema = Joi.object({
    title: Joi.string().required().label("Title"),
    description: Joi.string().required().label("description"),
    date: Joi.date().required().label("date"),
    location: Joi.string().required().label("location"),
    totalTickets: Joi.number().required().label("Total tickets"),
    availableTickets: Joi.number().required().label("Available tickets"),
    price: Joi.number().required().label("price"),

    })
    return schema.validate(data)
    }
    module.exports = { Event, validate }