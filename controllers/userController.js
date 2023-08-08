let bcrypt = require('bcrypt');
const express = require('express');
const { default: mongoose } = require('mongoose');
const Users = require('../BackEnd/models/userModel');
const Roles = require('../BackEnd/models/roleModel');
const Lots = require('../BackEnd/models/lotModel');
const jwt = require('jsonwebtoken');
const secretKey = 'azertyuio@%123456';
const verifyToken = require('../apiRoute/verifyToken');
let nodemailer = require('nodemailer');
const moment = require('moment');

let app = express();

exports.login = async function (req, res) {
  const email = req.body.email;
  const Password = req.body.password;
  await Users.findOne({ email: email })
    .then((existUser) => {
      console.log('exist user ', existUser);
      if (existUser && existUser._id) {
        bcrypt.compare(
          Password,
          existUser.password,
          async function (err, resp) {
            if (!err) {
              if (resp) {
                const AuthToken = jwt.sign(
                  { _id: existUser._id, email: existUser.email },
                  secretKey,
                  {
                    expiresIn: '1h',
                  }
                );
                await res.json({
                  status: 'okok',
                  data: { AuthToken, resp, existUser },
                });
              } else if (!resp) {
                res.json({ status: 'ok', data: { existUser, resp } });
              }
            }
          }
        );
      } else {
        res.json({ status: 'notExist', data: 'user exist pas' });
        console.log('not exist');
      }
    })
    .catch((err) => {
      res.json({ status: 'error', data: 'il ya une erreur' });
    });
};

(exports.dashboard = verifyToken),
  async (req, res) => {
    if (req && req.decodedToken) {
      res.json({ status: 'ok', data: 'ok' });
    } else {
      res.json({ status: 'erreur', data: 'erreur' });
    }
  };
exports.new = async (req, res, next) => {
  const result = await new Users({
    nom: req.body.nom,
    prenom: req.body.prenom,
    genre: req.body.genre,
    email: req.body.email,
    telephone: req.body.telephone,
    password: req.body.password,
    //idRole : req.body.idRole
  });
  const salt = await bcrypt.genSalt(10);
  await bcrypt.hash(req.body.password, salt).then((hashedPassword) => {
    console.log('hashed password', hashedPassword);
    result.password = hashedPassword;
  });
  await result.save();

  console.log(result);

  res.json({ message: 'user Inserted', data: result });
};

exports.index = async (req, res) => {
  const result = await Users.find().populate('idRole');
  res.json({
    result: result.map((result) => {
      return {
        _id: result._id,
        nom: result.nom,
        prenom: result.prenom,
        genre: result.genre,
        email: result.email,
        telephone: result.telephone,
        password: result.password,
        idRole: result.idRole,
        idLot: result.idLot,
      };
    }),
  });
};

exports.getUsers = async (req, res) => {
  const result = await Users.find();
  res.json(result);
};

exports.getNewUsers = async (req, res) => {
  const result = await Users.find({
    creationDate: { $gte: new Date(moment().subtract(1, 'day').toISOString()) },
  });
  res.json(result);
};

exports.insertByIdRole = async (req, res) => {
  const rid = req.params.rid;

  const role = await new Roles({
    nom: req.body.nom,
  }).save();
  //console.log(id);
  const user = await Users.findById(rid);
  // console.log('user:',user);
  user.idRole.push(role);
  // console.log(user.idRole.push(role));

  await user.save();

  res.json({
    message: 'inserted',
  });
};
exports.insertByIdLot = async (req, res) => {
  const lid = req.params.lid;

  const lot = await new Lots({
    nom: req.body.nom,
    description: req.body.description,
    ref_participation: req.body.ref_participation,
    reception: req.body.reception,
  }).save();
  //console.log(id);
  const user = await Users.findById(lid);
  // console.log('user:',user);
  user.idLot.push(lot);
  // console.log(user.idRole.push(role));

  await user.save();

  res.json({
    message: 'inserted',
  });
};

exports.delete = (req, res) => {
  Users.findByIdAndDelete(req.params.id, function (err, user) {
    if (err) {
      res.json({
        status: 0,
        message: err,
        message: 'le id existe pas, changeé le!',
      });
    } else {
      res.json({
        status: 1,
        message: 'bravo utilisateur suprrimer',
        data: user,
      });
    }
  });
};

exports.sendMail = async (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'meriem.larhouti@gmail.com', //replace with your email
      pass: 'j d n t x x n f f y e u v b j t', //replace with your password
    },
  });

  const result = await transporter.sendMail({
    from: 'meriem.larhouti@gmail.com',
    to: req.body.emailTo,
    subject: req.body.sujet,
    text: req.body.message,
  });

  console.log(JSON.stringify(result, null, 4));
  res.json({
    message: 'sending',
  });
};
exports.getAllLotsUsed = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs avec les lots associés
    const users = await Users.find().populate('idLot');

    const allLots = [];

    // Parcourir tous les utilisateurs et extraire les lots utilisés
    users.forEach((user) => {
      const lots = user.idLot;
      lots.forEach((lot) => {
        allLots.push({
          _id: lot._id,
          nom: lot.nom,
          description: lot.description,
          ref_participation: lot.ref_participation,
          reception: lot.reception,
          idUser: lot.idUser,
          idTicket: lot.idTicket,
        });
      });
    });

    res.json(allLots);
  } catch (error) {
    console.error('Erreur lors de la récupération des lots utilisés:', error);
    res.status(500).json({
      error:
        'Une erreur est survenue lors de la récupération des lots utilisés',
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur lors de la recherche de l'utilisateur:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la recherche de l'utilisateur",
    });
  }
};
exports.emplo = async (req, res) => {
  try {
    const users = await Users.find().populate('idLot');

    res.json({
      result: users.map((user) => {
        return {
          _id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          genre: user.genre,
          email: user.email,
          telephone: user.telephone,
          password: user.password,
          idRole: user.idRole,
          idLot: user.idLot.map((lot) => lot.nom), // Récupérer le nom du lot
        };
      }),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      error: 'Une erreur est survenue lors de la récupération des utilisateurs',
    });
  }
};
