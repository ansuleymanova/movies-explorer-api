const router = require('express').Router();
const { deleteMovieValidator, postMovieValidator } = require('../middlewares/validators');

const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', postMovieValidator, postMovie);
router.delete('/:id', deleteMovieValidator, deleteMovie);

module.exports = router;
