import React, { useState } from "react";
import "./addReview.css";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../components/UserContext/UserContext";

const AddReview: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { user } = useUser();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReview(event.target.value);
  };

  const handleSubmit = async () => {
    if (review.trim() && rating > 0) {
      const newReview = {
        hallName: name,
        rating,
        text: review,
        imageUrl: image ? URL.createObjectURL(image) : "",
      };
      try {
        const response = await fetch("http://localhost:3000/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReview),
          credentials: "include",
        });

        if (response.ok) {
          console.log("Review Submitted:", newReview);
          navigate(-1);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("Error submitting review.");
      }
    } else {
      alert("Please provide a rating and review text.");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="add-review">
      <h1>Add a Review</h1>
      <div className="rating-container">
        <label>Give this lecture hall a rating:</label>
        <div className="rating-boxes">
          {[0, 1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`rating-box ${num <= rating ? "selected" : ""}`}
              onClick={() => handleRatingChange(num)}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      <div className="review-container">
        <div className="give-review">
          <label htmlFor="review">Write a review:</label>
        </div>
        <textarea
          id="review"
          placeholder="What do you want others to know about this lecture hall?"
          value={review}
          onChange={handleReviewChange}
          maxLength={200}
        />
        <div className="word-count">{review.split(" ").length}/200</div>
      </div>
      <div className="image-upload-container">
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="image-preview" />
        )}
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <div className="image-button-container">
          <button
            className="upload-button"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            Choose File
          </button>
          {image && (
            <button className="remove-button" onClick={handleImageRemove}>
              X
            </button>
          )}
        </div>
      </div>
      <button className="submit-review-btn" onClick={handleSubmit}>
        Submit Review
      </button>
    </div>
  );
};

export default AddReview;
