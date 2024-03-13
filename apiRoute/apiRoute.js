let router = require('express').Router();
const userController = require('../controllers/userController');
const ticketController = require('../controllers/ticketController');
const roleController = require('../controllers/roleController');
const lotController = require('../controllers/lotController');
const employeurController = require('../controllers/employerController');
const { append } = require('express/lib/response');
const express = require('express');
const cors = require('cors');

router.get('/', function (req, res) {
  res.json({
    status: 1,
    message: 'hello',
  });
});

router.route('/users/').get(userController.index).post(userController.new);
router.route('/login', cors()).post(userController.login);
router.route('/logina', cors()).post(employeurController.logina);
router.route('/dashbord', cors()).get(userController.dashboard);
router.route('/users/:id').delete(userController.delete);

router.route('/users/:rid').post(userController.insertByIdRole);
router.route('/users/:lid').post(userController.insertByIdLot);
router.route('/getallticket').get(ticketController.getAllTickets);

router
  .route('/tickets/')
  .get(ticketController.index)
  .post(ticketController.new);
router.route('/tickets/:id').delete(ticketController.delete);

router.route('/tickets/:tid').post(ticketController.insertTicketByIdlot);

router.route('/roles/').get(roleController.index).post(roleController.new);
router.route('/roles/:id').delete(roleController.delete);

router.route('/roles/:rid').post(roleController.insertByIdUser);

router.route('/lots/').get(lotController.index).post(lotController.new);
router.route('/lots/:id').delete(lotController.delete);

router.route('/lots/:lid').post(lotController.insertLotByIdUser);
router.route('/lots/:tid').post(lotController.insertLotByIdTicket);

router.route('/getAllUsers/').get(userController.getUsers);

router.route('/getNewUsers/').get(userController.getNewUsers);

router.route('/getPlayedTickets/').get(ticketController.getPlayedTickets);

router.route('/getAllLots/').get(lotController.getLots);

router.route('/getLotByIdUser/:uid').get(lotController.getLotByIdUser);

router.route('/verify', cors()).post(ticketController.verify);

router.route('/sendMail', cors()).post(userController.sendMail);

router.route('/insertLot', cors()).post(lotController.insertLot);
router.route('/getAllLotsUsed').get(userController.getAllLotsUsed);
router.route('/emplo').get(userController.emplo);
router.route('/employeurs').post(employeurController.new);
router.route('/employeurss').get(employeurController.index);

router.route('/getUserById/:id').get(userController.getUserById);
router.route('/updatePrisStatus/:lotId').post(userController.updatePrisStatus);

module.exports = router;
