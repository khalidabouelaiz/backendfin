const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const employeurSchema = new Schema({
  nom: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const saltRounds = 10;

employeurSchema.pre('save', function (next) {
  const employeur = this;
  if (!employeur.isModified('password')) return next();

  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(employeur.password, salt, function (err, hash) {
      if (err) return next(err);
      employeur.password = hash;
      next();
    });
  });
});

let Employeur = mongoose.model('Employeur', employeurSchema);
module.exports = Employeur;
