const router = require('express').Router();
const { loginValidator, registerValidator } = require('../middlewares/validators');
const {
  login,
  register,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', loginValidator, login);

router.post('/signup', registerValidator, register);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  const error = new NotFoundError('Такой страницы не существует');
  next(error);
});

module.exports = router;
