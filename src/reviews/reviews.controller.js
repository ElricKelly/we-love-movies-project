const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next){
    const foundReview = await reviewsService.read(req.params.reviewId);
  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function destroy(req, res, next){
    await reviewsService.destroy(Number(req.params.reviewId));
    res.sendStatus(204);
}

async function update(req, res, next){
    const newReview = {
        ...res.locals.review,
        ...req.body.data
    }

    await reviewsService.update(newReview);
    const updatedReview = await reviewsService.read(newReview.review_id)
    updatedReview.critic = await reviewsService.getCriticById(newReview.critic_id);
    res.status(200).json({ data: updatedReview });
}

module.exports = {
    destroy: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};