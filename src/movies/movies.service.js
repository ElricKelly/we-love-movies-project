const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at"
})

function list() {
  return knex("movies").select("*");
}

function listShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .select("m.*")
    .where("mt.is_showing", true)
    .groupBy("m.movie_id");
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function listMoviesWithTheaters(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .where({"mt.movie_id": movieId})
    .select("*");
}

function listMoviesWithReviews(movieId){
  return knex("reviews as r")
  .join("critics as c", "r.critic_id", "c.critic_id")
  .select(
    "r.*",
    "c.critic_id",
    "c.preferred_name",
    "c.surname",
    "c.organization_name",
    "c.created_at as created",
    "c.updated_at as updated"
  )
  .where({ "r.movie_id": movieId })
  .then(data => data.map (critic => addCritic(critic)))
}

module.exports = {
  list,
  listShowing,
  read,
  listMoviesWithTheaters,
  listMoviesWithReviews
};