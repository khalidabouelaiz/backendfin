// import { describe } from "@hapi/joi/lib/base"
const request = require('supertest');
const { app, db } = require('../index');
const { ObjectId } = require('mongoose').Types;
const userController = require('../Controllers/userController');
const User = require("../BackEnd/models/userModel")
const Email = require("../BackEnd/models/email");
const Ticket = require('../BackEnd/models/tickeModel');
const Lot = require('../BackEnd/models/lotModel');
const Role = require('../BackEnd/models/roleModel');
const mongoose = require('mongoose');

describe('Email Controller', () => {
    // Increase the timeout value to 10 seconds
    jest.setTimeout(100000);
    afterAll(async () => {
      // delete all documents inside users collection
      await User.deleteMany({});
      
      // delete all documents inside emails collection
      await Email.deleteMany({});
      
      // delete all documents inside tickets collection
      await Ticket.deleteMany({});
      
      // delete all documents inside lots collection
      await Lot.deleteMany({});
      
      // delete all documents inside roles collection
      await Role.deleteMany({});
    });


  // test /email
  const mockResult = [
      {
        _id: '123',
        nom: 'John',
        prenom: 'Doe',
        email: 'john.doe@example.com',
        telephone: '555-555-5555',
        mesage: 'Hello World!',
        Etat_repond: true
      }
    ];

  // Mock the email1.find() function to return our mock result
  jest.spyOn(Email, 'find').mockResolvedValue(mockResult);
  
  test('should return an array of users', async () => {
    const response = await request(app).get('/api/email');
    expect(response.body.result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          nom: expect.any(String),
          prenom: expect.any(String),
          email: expect.any(String),
          telephone: expect.any(String),
          mesage: expect.any(String),
          Etat_repond: expect.any(Boolean)
        })
      ])
    );
  });
  test('should return the correct array of users', async () => {
    const response = await request(app).get('/api/email');
    expect(response.body.result[0]).toMatchObject(mockResult[0]);
  });

});


describe('User Controller', () => {
    jest.setTimeout(100000);
    afterAll(async () => {
      // delete all documents inside users collection
      await User.deleteMany({});
      
      // delete all documents inside emails collection
      await Email.deleteMany({});
      
      // delete all documents inside tickets collection
      await Ticket.deleteMany({});
      
      // delete all documents inside lots collection
      await Lot.deleteMany({});
      
      // delete all documents inside roles collection
      await Role.deleteMany({});
    });
  // test /users/
  test('should create a new client user', async () => {
    const user = {
        nom: 'testNom',
        prenom: 'testPrenom',
        genre: 'testGenre',
        email: 'test@example.com',
        telephone: 1234567,
        password: "password",
        isAdmin: false,
    };
    const response = await request(app)
      .post('/api/users/')
      .send(user)
      .expect(200);

    const storedUser = await User.findById(response.body.data._id);
    console.log(storedUser)
    expect(storedUser.nom).toBe(user.nom);
    expect(storedUser.prenom).toBe(user.prenom);
    expect(storedUser.genre).toBe(user.genre);
    expect(storedUser.email).toBe(user.email);
    expect(storedUser.telephone).toBe(user.telephone);
    expect(storedUser.isAdmin).toBe(user.isAdmin);
  });

  // test /users/EMP
  test('should create a new employee user', async () => {
    const user = {
        nom: 'testNomEmp',
        prenom: 'testPrenomEmp',
        genre: 'testGenre',
        email: 'testEmp@gmail.com',
        telephone: 12345678,
        password: "test12345",
        isAdmin: false,
    };
    const response = await request(app)
      .post('/api/users/EMP')
      .send(user)
      .expect(200);

    const storedUser = await User.findById(response.body.data._id);
    console.log(storedUser)
    expect(storedUser.nom).toBe(user.nom);
    expect(storedUser.prenom).toBe(user.prenom);
    expect(storedUser.genre).toBe(user.genre);
    expect(storedUser.email).toBe(user.email);
    expect(storedUser.telephone).toBe(user.telephone);
    expect(storedUser.isAdmin).toBe(user.isAdmin);
  });

  // test /api/login
  test('should return a token when user with email and password is found', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.data.AuthToken).toBeTruthy();
  });

  test('should return a user object when non-admin user with email and password is found', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.data.existAdmin).toBeTruthy();
    expect(response.body.data.existAdmin.isAdmin).toBe(false);
  });

  test('should return an error message when creds are wrong', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'nonexistent@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('error1');
    expect(response.body.data).toBe('il ya une erreur');
  });
  // test /api/users/
  test('should delete a user successfully', async () => {
    const user = new User({
        nom: 'testNom',
        prenom: 'testPrenom',
        genre: 'testGenre',
        email: 'new@example.com',
        telephone: 1234567,
        password: "password",
        isAdmin: false,
    });
    await user.save();
    const res = await request(app).delete(`/api/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(1);
    expect(res.body.message).toBe('votre compte est supprimer');
    expect(res.body.data._id).toBe(String(user._id));
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });
  test('should return an error if the user does not exist', async () => {
    const res = await request(app).delete('/api/users/123');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(0);
    expect(res.body.message).toBe('supprission echoue!');
  });
  // test /addgain/:lid/:nom/:description
  test('should insert a lot by user', async () => {
    const user = await User.create({
        nom: 'testNom',
        prenom: 'testPrenom',
        genre: 'testGenre',
        email: 'new1@example.com',
        telephone: 1234567,
        password: "password",
        isAdmin: false,
    });
    const nom = 'Lot 1';
    const description = 'Description of Lot 1';
    const response = await request(app)
      .post(`/api/addgain/${user._id}/${nom}/${description}`)
      .expect(200);

    expect(response.body.message).toEqual('inserted lot by user');

    const updatedUser = await User.findById(user.id).populate('idLot');
    expect(updatedUser.idLot.length).toBe(1);
    expect(updatedUser.idLot[0].nom).toEqual(nom);
    expect(updatedUser.idLot[0].description).toEqual(description);
  });
  // test /updateEtat/:uid/
  test('updates the users Etat_P and Etat_obtention', async () => {
    // create a new user to update
    const user = await User.create({
        nom: 'testNom',
        prenom: 'testPrenom',
        genre: 'testGenre',
        email: 'new2@example.com',
        telephone: 1234567,
        password: "password",
        isAdmin: false,
        Etat_P: false,
        Etat_obtention: 'Non obtenu'
    });

    const response = await request(app)
      .put(`/api/updateEtat/${user._id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Update Etat_P by user');

    // fetch the updated user from the database
    const updatedUser = await User.findById(user._id);

    expect(updatedUser.Etat_P).toBe(true);
    expect(updatedUser.Etat_obtention).toBe('En cours...');
  });

  // test /userslot/:lid
  test('should insert a new lot and update the user document', async () => {
    const user = await User.create({
        nom: 'testNom',
        prenom: 'testPrenom',
        genre: 'testGenre',
        email: 'new3@example.com',
        telephone: 1234567,
        password: "password",
        isAdmin: false,
        idLot: [],
    });
    await user.save();

    const response = await request(app)
      .post(`/api/userslot/${user._id}`)
      .send({
        nom: 'Test Lot',
        description: 'This is a test lot'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('inserted');

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.idLot.length).toBe(1);
  });

  // test /finduserbyid/:uid
  test('should return a user by id with populated idTicket and idLot', async () => {
    const idLot = new ObjectId()
    const idTicket = new ObjectId()
    const mockUser = await User.create({
        nom: 'testNom',
        prenom: 'testPrenom',
        genre: 'testGenre',
        email: 'new15@example.com',
        telephone: 1234567,
        password: "password",
        isAdmin: false,
        idLot: idLot,
        idTicket: idTicket,
        Etat_P: false,
    });
    const response = await request(app).get(`/api/finduserbyid/${mockUser._id}`);
    expect(response.status).toBe(200);
  });

  // test /chercherUser
  test('responds with json containing a list of users', async () => {
    const response = await request(app)
      .get('/api/chercherUser')
      .send({ body: true })
      .expect('Content-Type', /json/)
      .expect(200);
      
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('idLot');
    expect(response.body[0]).toHaveProperty('idTicket');
  });

  // // test /emailuse/:email
  test('returns the user email if the account exists', async () => {
    // create a fake user with the given email address
    const user = await User.create({
      nom: 'testNom',
      prenom: 'testPrenom',
      genre: 'testGenre',
      email: 'new10@example.com',
      telephone: 1234567,
      password: "password",
      isAdmin: false,
  });
    const email = 'new10@example.com';

    // send a GET request to the /api/email/:email endpoint
    const response = await request(app).get(`/api/emailuse/${email}`);

    // assert that the response is successful and contains the expected email address
    expect(response.status).toBe(200);
    expect(response.body.result[0].email).toBe(email);
  });

  // // test /UpdateEtatobtention/:uid
  test('updates Etat_obtention field for a user', async () => {
    const user = await User.create({
        nom: 'testNom',
        prenom: 'testPrenom',
        genre: 'testGenre',
        email: 'new6@example.com',
        telephone: 1234567,
        password: "password",
        isAdmin: false,
        Etat_obtention: 'En cours',
    });
    
    const response = await request(app)
      .put(`/api/UpdateEtatobtention/${user._id}`)
      .send({
        Etat_obtention: 'Recu',
      })
      .expect(200);

    expect(response.body.message).toEqual('Update Etat_obtention  by user');
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.Etat_obtention).toEqual('Recu');
  });

  // // test /EmailChimp/:email
  test('should return JSON with the response body', async () => {
    const email = 'test@example.com';

    const response = await request(app)
      .post(`/api/EmailChimp/${email}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(typeof response.body.data).toBe('string');
  });

  test('should return a 401 status in case of wrong email format', async () => {
    const response = await request(app)
      .post('/api/EmailChimp/wrong_email_format')
      .expect(200);
    expect(response.body.data).toContain('401');
  });

});

describe('Ticket Controller', () => {
    
    afterAll(async () => {
      // delete all documents inside users collection
      await User.deleteMany({});
      
      // delete all documents inside emails collection
      await Email.deleteMany({});
      
      // delete all documents inside tickets collection
      await Ticket.deleteMany({});
      
      // delete all documents inside lots collection
      await Lot.deleteMany({});
      
      // delete all documents inside roles collection
      await Role.deleteMany({});
    });
    // test /tickets/
    test('should return an array of tickets', async () => {
        const response = await request(app).get('/api/tickets');
        if (response.body.result.length === 0) {
          expect(response.body.result).toHaveLength(0);
        } else {
          expect(response.body.result).toEqual(
              expect.arrayContaining([
                {
                  _id: expect.any(String),
                  statusT: expect.any(String),
                  Prix: expect.any(Number),
                }
              ])
          );
        }
      });

    // test /tickets/:id
    test('should delete a ticket successfully', async () => {
        const ticket = new Ticket({
            statusT: 'status',
            Prix: 123,
            ref_participation: 123,
        });
        await ticket.save();
        const res = await request(app).delete(`/api/tickets/${ticket._id}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe(1);
        expect(res.body.message).toBe('bravo ticket suprrimer');
        expect(res.body.data._id).toBe(String(ticket._id));
        const deletedTicket = await Ticket.findById(ticket._id);
        expect(deletedTicket).toBeNull();
      });  
      
    // test /AfficherTicketU/
    test('should return all tickets with utilise=true', async () => {
      const tickets = await Ticket.insertMany([
        {
          statusT: "test",
          utilise: true,
          ref_participation: 13,
          Prix: 13,
        },
        {
          statusT: "test",
          utilise: false,
          ref_participation: 14,
          Prix: 14,
        },
        {
          statusT: "test",
          utilise: true,
          ref_participation: 12,
          Prix: 12,
        },
      ]);
        
      const response = await request(app)
        .get('/api/AfficherTicketU')
        .expect(200);

      // Assert that the response body contains the expected data
      expect(response.body).toHaveLength(2);
      expect(response.body[0].utilise).toBe(true);
      expect(response.body[1].utilise).toBe(true);
    });

});
describe('Lots Controller', () => {
    afterAll(async () => {
      // delete all documents inside users collection
      await User.deleteMany({});
      
      // delete all documents inside emails collection
      await Email.deleteMany({});
      
      // delete all documents inside tickets collection
      await Ticket.deleteMany({});
      
      // delete all documents inside lots collection
      await Lot.deleteMany({});
      
      // delete all documents inside roles collection
      await Role.deleteMany({});
    });
    // test /lots/
    test('should return an array of lots', async () => {
        const response = await request(app).get('/api/lots');        
        if (response.body.result.length === 0) {
          expect(response.body.result).toHaveLength(0);
        } else {
          expect(response.body.result).toEqual(
              expect.arrayContaining([
                {
                  _id: expect.any(String),
                  description: expect.any(String),
                  nom: expect.any(String),
                }
              ])
          );
        }
      });

    // test /lots/:id
    test('should delete a lot successfully', async () => {
        const lot = new Lot({
            nom: 'test',
            ref_participation: "123",
            reception: "123",
        });
        await lot.save();
        const res = await request(app).delete(`/api/lots/${lot._id}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe(1);
        expect(res.body.message).toBe('bravo lot suprrimer');
        expect(res.body.data._id).toBe(String(lot._id));
        const deletedLot = await Lot.findById(lot._id);
        expect(deletedLot).toBeNull();
      });    
});

describe('Roles Controller', () => {
    afterAll(async () => {
      // delete all documents inside users collection
      await User.deleteMany({});
      
      // delete all documents inside emails collection
      await Email.deleteMany({});
      
      // delete all documents inside tickets collection
      await Ticket.deleteMany({});
      
      // delete all documents inside lots collection
      await Lot.deleteMany({});
      
      // delete all documents inside roles collection
      await Role.deleteMany({});
    });
    // test /roles/
    test('should return an array of roles', async () => {
        const response = await request(app).get('/api/roles');
        if (response.body.result.length === 0) {
          expect(response.body.result).toHaveLength(0);
        } else {
          expect(response.body.result).toEqual(
              expect.arrayContaining([
                {
                  _id: expect.any(String),
                  nom: expect.any(String),
                }
              ])
          );
        }
      });

    // test /lots/:id
    test('should delete a role successfully', async () => {
        const role = new Role({
            nom: 'test',
            idUser: "123",
        });
        await role.save();
        const res = await request(app).delete(`/api/roles/${role._id}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe(1);
        expect(res.body.message).toBe('bravo role suprrimer');
        expect(res.body.data._id).toBe(String(role._id));
        const deletedRole = await Role.findById(role._id);
        expect(deletedRole).toBeNull();
      });    
});
