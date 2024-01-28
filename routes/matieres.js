let Matiere = require('../model/matiere');


// Récupérer toutes les matières (GET)
function getMatieres(req, res){
    Matiere.find((err, matieres) => {
        if(err){
            res.send(err)
        }

        res.send(matieres);
    });
}

module.exports = { getMatieres };