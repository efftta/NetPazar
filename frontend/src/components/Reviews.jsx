import React, { useState } from "react";
import { reviewData } from "../data/reviews";

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState(reviewData[productId] || reviewData["default"]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = { name, comment, rating: parseInt(rating) };
    setReviews([...reviews, newReview]);
    setName("");
    setComment("");
    setRating(5);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Yorumlar</h3>
      <ul className="space-y-4 mb-6">
        {reviews.map((rev, index) => (
          <li key={index} className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-300">{rev.name} - {"⭐".repeat(rev.rating)}</p>
            <p>{rev.comment}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg space-y-3">
        <input
          type="text"
          placeholder="Adınız"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Yorumunuz"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>
              {star} Yıldız
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded">
          Yorumu Gönder
        </button>
      </form>
    </div>
  );
};

export default Reviews;
