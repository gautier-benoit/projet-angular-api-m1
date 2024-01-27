let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LoginSchema = Schema({
    login: {type: String,
        required: true,
        unique: true},
    password: String,
    lastName: String,
    firstName: String,
    accessType: String,
    civility: String
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('users', LoginSchema, 'users');