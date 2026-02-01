import Review from "../models/Review.js";
import MenuItem from "../models/MenuItem.js";

// Create a review
export const createReview = async (req, res) => {
  try {
    const { itemId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!itemId || !rating) {
      return res
        .status(400)
        .json({ message: "Item ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = new Review({
      userId,
      itemId,
      rating,
      comment,
    });

    await review.save();

    // Update item average rating
    const reviews = await Review.find({ itemId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await MenuItem.findByIdAndUpdate(itemId, {
      $set: {
        averageRating: avgRating,
        reviewCount: reviews.length,
      },
    });

    res
      .status(201)
      .json({ message: "Review created successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for an item
export const getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;

    const reviews = await Review.find({ itemId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name")
      .populate("itemId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update item rating
    const itemId = review.itemId;
    const reviews = await Review.find({ itemId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await MenuItem.findByIdAndUpdate(itemId, {
      $set: {
        averageRating: avgRating,
        reviewCount: reviews.length,
      },
    });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
