const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getSelf,
  updateSelf,
} = require('../controllers/users');

router.get('/me', getSelf);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateSelf);

module.exports = router;
