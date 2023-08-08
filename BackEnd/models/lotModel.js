const mongoose = require('mongoose');

const Schema = require('mongoose');

const userShema = mongoose.Schema({
  nom: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 50,
  },
  ref_participation: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 50,
  },
  reception: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 50,
  },
  idUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  idTicket: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
});

let Lot = (module.exports = mongoose.model('Lot', userShema));
exports.Lot = Lot;
