const mongoose = require('mongoose');
const { Lot } = require('./lotModel');
const { User } = require('./userModel');
const Schema = require('mongoose');

const userShema = mongoose.Schema({
  numeroT: {
    type: String,
    required: true,
    minlenght: 10,
    maxlength: 10,
  },
  statusT: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 50,
  },
  idLot: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lot' }],
  idUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

let Ticket = (module.exports = mongoose.model('Ticket', userShema));
exports.Ticket = Ticket;
