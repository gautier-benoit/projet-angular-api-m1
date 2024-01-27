const Login = require('../model/login');
const jwt = require('jsonwebtoken');

const passwordHashKey = "clemgomiage";
const tokenEncryptionKey = "JpyNnyymeFtftRDJd68X";

// Handles the POST request for user login.
function postLogin(req, res) {
  let username = req.body.login;
  let password = hash(req.body.password);
  Login.findOne({ login: username }, (err, login) => {

    if (err) {
      res.send(err)
    }
    if (login === null) {
      res.json({ message: 'LOG' });
    }
    if (login.password === password) {
      res.json({ message: "TRUE", token: generateToken(login) });
    } else {
      res.json({ message: 'FALSE' });
    }
  })
  console.log("postLogin");
}

// Ajout d'un user (POST)
function postRegister(req, res, next) {
  let login = new Login();
  login.login = req.body.login;
  login.password = hash(req.body.password);
  login.lastName = req.body.lastName;
  login.firstName = req.body.firstName;
  login.accessType = req.body.accessType;
  login.civility = req.body.civility;

  console.log("POST Register reçu :");

  login.save((err) => {
    if (err) {
      res.status(400).json({ message: `Error, cannot save: ${err.message}` })
      return;
    }
    res.json({ message: "TRUE", token: generateToken(login) })
  })
  console.log("postRegister");
}

// Hashes a password using the sha512 algorithm.
function hash(password) {
  const hash = crypto.createHmac('sha512', passwordHashKey);
  return hash.update(password).digest('hex');
}

// Generates a token for the given user.
function generateToken(user) {
  return jwt.sign({
    sub: user._id,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
    userData: user
  }, tokenEncryptionKey);
}

/**
 * Verifies the token provided in the request headers.
 * If the token is valid, it decodes it and attaches the decoded user information to the request object.
 * If the token is not provided or invalid, it returns an error response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object or calls the next middleware function.
 */
function verifyToken(req, res, next) {
  const token = req.headers['Authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  return jwt.verify(token, tokenEncryptionKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    return next();
  });
}

module.exports = { postLogin, postRegister, verifyToken };
global.crypto = require('crypto');