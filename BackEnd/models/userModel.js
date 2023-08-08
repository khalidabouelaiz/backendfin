const mongoose = require('mongoose');
const Schema = require('mongoose');

const joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');
const { Role } = require('./roleModel');

const userShema = mongoose.Schema({
  nom: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 50,
  },
  prenom: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 50,
  },
  genre: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 255,
    unique: true,
  },
  telephone: {
    type: Number,
    required: true,
    maxlength: 15,
  },
  password: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 255,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  idRole: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  idLot: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lot' }],

  isAdmin: Boolean,
});

let User = (module.exports = mongoose.model('User', userShema));
exports.User = User;
