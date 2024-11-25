const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Buyer', 'Supplier'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  business: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Entity = mongoose.model('Entity', entitySchema);

module.exports = Entity;
