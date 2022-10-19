const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regEx } = require('../utils/constants');

const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regEx),
    trailerLink: Joi.string().required().regex(regEx),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(regEx),
    movieId: Joi.number().required(),
  }),
}), postMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
