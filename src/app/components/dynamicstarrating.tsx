'use client';

import { DynamicStarRatingProps } from "@/app/lib/definitions";

export default function DynamicStars({ onRatingChange, rating }: DynamicStarRatingProps) {

  const handleStarClick = (index: number) => {
    const newRating = index + 1;
    onRatingChange?.(newRating)
  };

  return (
    <div style={{ fontSize: "2rem", cursor: "pointer" }}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          style={{ color: index < rating ? "#FF5A2D" : "gray" }}
          onClick={() => handleStarClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

