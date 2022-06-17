const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const foundMovie = await moviesService.read(req.params.movieId);
  if (foundMovie) {
    res.locals.movie = foundMovie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

async function list(req, res, next) {
  const is_showing = req.query.is_showing;
  if (is_showing) {
    return next();
  }

  const allMovies = await moviesService.list();
  res.json({ data: allMovies });
}

async function listShowing(req, res, next) {
  res.json({ data: await moviesService.listShowing() });
}

async function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function readMoviesWithTheaters(req, res, next){
  const data = await moviesService.listMoviesWithTheaters(Number(req.params.movieId));
  res.json({data});
}

async function readMoviesWithReviews(req, res, next){
  const data = await moviesService.listMoviesWithReviews(Number(req.params.movieId));
  res.json({data});
}

module.exports = {
  list: [asyncErrorBoundary(list), asyncErrorBoundary(listShowing)],
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  readMoviesWithTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readMoviesWithTheaters)],
  readMoviesWithReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readMoviesWithReviews)],
};
