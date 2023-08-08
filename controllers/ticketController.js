const { validate } = require('@hapi/joi/lib/base');
let bcrypt = require('bcrypt');
const { Ticket } = require('../BackEnd/models/tickeModel');
const Lots = require('../BackEnd/models/lotModel');
const Tickets = require('../BackEnd/models/tickeModel');
const Users = require('../BackEnd/models/userModel');
function generateTicketNumber() {
  const min = 1000000000; // Numéro minimum de 10 chiffres
  const max = 9999999999; // Numéro maximum de 10 chiffres
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.new = (req, res, next) => {
  const numeroT = generateTicketNumber().toString();
  const result = new Tickets({
    numeroT: numeroT,
    statusT: req.body.statusT,
  }).save();
  res.json({
    message: 'ticket Inserted',
  });
};
async function checkIfTicketIsUsed(ticketId) {
  try {
    const result = await Users.findOne({ 'idUser.tickets': ticketId });
    return result !== null;
  } catch (error) {
    return false;
  }
}
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Tickets.find();

    // Vérifier si les tickets sont utilisés ou non
    const results = await Promise.all(
      tickets.map(async (ticket) => {
        const isUsed = await checkIfTicketIsUsed(ticket._id);
        return {
          _id: ticket._id,
          numeroT: ticket.numeroT,
          statusT: ticket.statusT,
        };
      })
    );

    res.json({ status: 'ok', data: results });
  } catch (error) {
    res.json({ status: 'error', data: 'There was an error' });
  }
};

exports.verify = async (req, res) => {
  const uid = req.body.uid;
  const numero = req.body.numero;
  await Tickets.findOne({ numeroT: numero })
    .then((existTicket) => {
      console.log('exiiitt', existTicket);
      if (existTicket && existTicket._id && existTicket.statusT !== 'played') {
        Users.findById(uid).then((currentUser) => {
          existTicket.idUser.push(currentUser);
          existTicket.save();
        });
        res.json({ status: 'ok', data: { tid: existTicket._id, uid: uid } });
      } else {
        res.json({ status: 'notExist', data: 'ticket exist pas' });
        console.log('not exist');
      }
    })
    .catch((err) => {
      res.json({ status: 'error', data: 'il ya une erreur' });
    });
};

exports.index = async (req, res) => {
  const result = await Tickets.find();
  res.json({
    result: result.map((result) => {
      return {
        _id: result._id,
        statusT: result.statusT,
        idLot: result.idLot,
      };
    }),
  });
};

exports.getPlayedTickets = async (req, res) => {
  const result = await Tickets.find({ statusT: 'played' });
  res.json(result);
};

exports.insertTicketByIdlot = async (req, res) => {
  const tid = req.params.tid;

  const lot = await new Lots({
    nom: req.body.nom,
    description: req.body.description,
    ref_participation: req.body.ref_participation,
    reception: req.body.reception,
  }).save();

  const ticket = await Tickets.findById(tid);
  console.log('user:', ticket);
  ticket.idLot.push(lot);
  await ticket.save();

  res.json({
    message: 'inserted',
  });
};
exports.delete = (req, res) => {
  Tickets.findByIdAndDelete(req.params.id, function (err, ticket) {
    if (err) {
      res.json({
        status: 0,
        message: err,
        message: 'le id existe pas, changeé le!',
      });
    } else {
      res.json({
        status: 1,
        message: 'bravo ticket suprrimer',
        data: ticket,
      });
    }
  });
};
