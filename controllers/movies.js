const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

function getMovies(req, res, next) {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (movies.length === 0) {
        res.status(200).send({ message: 'У вас пока нет фильмов' });
      } else {
        res.status(200).send(movies);
      }
    })
    .catch(next);
}

function postMovie(req, res, next) {
  Movie.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Такого фильма нет');
      }
      if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Удалить чужой фильм нельзя');
      }
      return movie.remove().then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
