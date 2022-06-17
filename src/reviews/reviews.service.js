const knex = require("../db/connection");

function read(reviewId) {
    return knex("reviews").select("*").where({ review_id: reviewId }).first();
  }

function destroy(reviewId){
    return knex("reviews").where({ review_id: reviewId }).del();
}

function update(newReview){
    return knex("reviews")
    .where({ review_id: newReview.review_id })
    .update(newReview, ["*"])
    .then((data) => data[0]);
}

function getCriticById(criticId){
    return knex("critics")
    .where({ critic_id: criticId })
    .first();
}

module.exports = {
    read,
    destroy,
    update,
    getCriticById,
}