const { validate } = require('@hapi/joi/lib/base');
let bcrypt = require('bcrypt');

const Roles = require('../BackEnd/models/roleModel');
const Users = require('../BackEnd/models/userModel');

exports.new = (req, res, next) => {
  const result = new Roles({
    nom: req.body.nom,
  }).save();
  res.json({
    message: 'role Inserted',
  });
};

exports.index = async (req, res) => {
  const result = await Roles.find().populate('idUser');
  res.json({
    result: result.map((result) => {
      return {
        _id: result._id,
        nom: result.nom,
        idUser: result.idUser,
      };
    }),
  });
};

exports.insertByIdUser = async (req, res) => {
  const rid = req.params.rid;

  const user = await new Users({
    nom: req.body.nom,
    prenom: req.body.prenom,
    genre: req.body.genre,
    email: req.body.email,
    telephone: req.body.telephone,
    password: req.body.password,
  }).save();

  const role = await Roles.findById(rid);
  console.log('user:', role);
  role.idUser.push(user);
  await role.save();

  res.json({
    message: 'inserted',
  });
};
exports.delete = (req, res) => {
  Roles.findByIdAndDelete(req.params.id, function (err, role) {
    if (err) {
      res.json({
        status: 0,
        message: err,
        message: 'le id existe pas, changeé le!',
      });
    } else {
      res.json({
        status: 1,
        message: 'bravo role suprrimer',
        data: role,
      });
    }
  });
};
