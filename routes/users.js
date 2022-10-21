const router = require('express').Router();
const { updateSelfValidator } = require('../middlewares/validators');
const {
  getSelf,
  updateSelf,
} = require('../controllers/users');

router.get('/me', getSelf);
router.patch('/me', updateSelfValidator, updateSelf);

module.exports = router;
