import React, { useState, useEffect } from 'react';
import { FiThumbsUp, FiThumbsDown, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { reviewService } from '../services/featureService';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

const ReviewsSection = ({ productId, onRatingUpdate }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getProductReviews(productId, page);
      if (response.success) {
        setReviews(response.data.reviews || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        rating,
        title,
        comment,
        images,
      };

      let response;
      if (editingId) {
        response = await reviewService.updateReview(editingId, reviewData);
      } else {
        response = await reviewService.createReview(productId, reviewData);
      }

      if (response.success) {
        toast.success(editingId ? 'Review updated' : 'Review posted');
        setTitle('');
        setComment('');
        setRating(5);
        setImages([]);
        setEditingId(null);
        setShowForm(false);
        setPage(1);
        fetchReviews();
        if (onRatingUpdate) {
          onRatingUpdate();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await reviewService.deleteReview(reviewId);
      if (response.success) {
        toast.success('Review deleted');
        setPage(1);
        fetchReviews();
        if (onRatingUpdate) {
          onRatingUpdate();
        }
      }
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleHelpful = async (reviewId, isHelpful) => {
    try {
      const response = await reviewService.markHelpful(reviewId, isHelpful);
      if (response.success) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to mark review:', error);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setTitle(review.title);
    setComment(review.comment);
    setImages(review.images || []);
    setShowForm(true);
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Review Form */}
      {user && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setEditingId(null);
                setTitle('');
                setComment('');
                setRating(5);
                setImages([]);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  <StarRating rating={rating} onRate={setRating} interactive />
                  <span className="text-lg font-semibold">{rating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product"
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500"
                />
                {images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : editingId ? 'Update Review' : 'Post Review'}
              </button>
            </form>
          )}
        </div>
      )}

      {!user && (
        <div className="mb-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-blue-900">Please log in to write a review</p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} interactive={false} />
                    <span className="font-semibold text-gray-900">{review.title}</span>
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  by {review.userId.name} • {new Date(review.createdAt).toLocaleDateString()}
                </p>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="review"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleHelpful(review._id, true)}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
                    >
                      <FiThumbsUp size={16} />
                      <span className="text-sm">{review.helpfulCount}</span>
                    </button>
                    <button
                      onClick={() => handleHelpful(review._id, false)}
                      className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                    >
                      <FiThumbsDown size={16} />
                      <span className="text-sm">{review.unhelpfulCount}</span>
                    </button>
                  </div>

                  {user && user._id === review.userId._id && (
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-gray-600 hover:text-blue-500"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-gray-600 hover:text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg ${
                    page === p
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsSection;
