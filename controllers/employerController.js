let bcrypt = require('bcrypt');
const Employeurs = require('../BackEnd/models/employeurModel');


exports.logina = async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const employer = await Employeurs.findOne({ email: email });
    if (employer) {
      const passwordMatch = await bcrypt.compare(password, employer.password);

      if (passwordMatch) {
        // Mot de passe correct
        res.json({ status: 'success', data: 'Connexion réussie' });
      } else {
        // Mot de passe incorrect
        res.json({ status: 'error', data: 'Mot de passe incorrect' });
      }
    } else {
      // L'employeur n'existe pas
      res.json({ status: 'error', data: 'Employeur introuvable' });
    }
  } catch (error) {
    // Une erreur s'est produite lors de la recherche de l'employeur dans la base de données
    console.error("Erreur lors du login de l'employeur:", error);
    res.status(500).json({
      status: 'error',
      data: 'Une erreur est survenue lors de la connexion',
    });
  }
};
exports.new = (req, res, next) => {
  const result = new Employeurs({
    nom: req.body.nom,
    email: req.body.email,
    password: req.body.password,
  }).save();
  res.json({
    message: 'Employeur Inserted',
  });
};
exports.index = async (req, res) => {
  const result = await Employeurs.find();
  res.json({
    result: result.map((result) => {
      return {
        _id: result._id,
        nom: result.nom,
        email: result.email,
        password: result.password,
      };
    }),
  });
};

exports.insertUserInEmployeur = async (req, res) => {
  const eid = req.params.eid;
  const user = await new Users({
    nom: req.body.nom,
    prenom: req.body.prenom,
    genre: req.body.genre,
    email: req.body.email,
    telephone: req.body.telephone,
    password: req.body.password,
  }).save();

  const employeur = await Employeurs.findById(eid);
  employeur.idUser.push(user);
  await employeur.save();

  res.json({
    message: 'User inserted into Employeur',
  });
};

exports.delete = (req, res) => {
  Employeurs.findByIdAndDelete(req.params.id, function (err, employeur) {
    if (err) {
      res.json({
        status: 0,
        message: "Erreur lors de la suppression de l'employeur",
        error: err,
      });
    } else {
      res.json({
        status: 1,
        message: 'Employeur supprimé avec succès',
        data: employeur,
      });
    }
  });
};
