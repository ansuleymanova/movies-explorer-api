const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWTdev } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');

function register(req, res, next) {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => res.status(200).send(user))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с такой почтой уже зарегистрирован'));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    }).catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new UnauthorizedError('Неверная почта или пароль');
    }
    bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new UnauthorizedError('Неверная почта или пароль');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWTdev,
        { expiresIn: '7d' },
      );
      res
        .send({ token });
    }).catch(next);
  }).catch(next);
}

function getSelf(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя нет');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const newErr = new BadRequestError('Переданы некорректные данные');
        next(newErr);
      } else {
        next(err);
      }
    });
}

function updateSelf(req, res, next) {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя нет');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        const newErr = new BadRequestError('Переданы некорректные данные');
        next(newErr);
      } else {
        next(err);
      }
    });
}

module.exports = {
  register,
  login,
  getSelf,
  updateSelf,
};
