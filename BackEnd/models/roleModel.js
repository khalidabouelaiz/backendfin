const mongoose = require('mongoose');
const Schema = require('mongoose');

const userShema = mongoose.Schema({
  nom: {
    type: String,
    required: true,
    minlenght: 3,
    maxlength: 50,
  },
  idUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

let Role = (module.exports = mongoose.model('Role', userShema));
exports.Role = Role;
