const router = require('express').Router();
const Auth = require('./userModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {
  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcrypt.hashSync(req.body.password, rounds);
  req.body.password = hash;

  Auth.addUser(req.body)
  .then(newUser => {
      res.status(201).json(newUser);
  })
  .catch(err => {
      res.status(500).json(err);
  })
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  Auth.getByUsername(username)
  .then(user => {
    if(user && bcrypt.compareSync(password, user.password)){
      const token = generateToken(user);
      res.status(201).json(token);
    }else{
      res.status(404).json({ message: 'You shall not pass' });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

function generateToken(user) {
  const payload = {
      sub: user.id,
      name: user.username
  };
  const secret = process.env.JWT_SECRET || 'This is a secret';
  const options = {
      expiresIn: '1h'
  }
  return jwt.sign(payload, secret, options);
}

module.exports = router;
