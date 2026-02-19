'use client';

import { DynamicStarRatingProps } from "@/app/lib/definitions";
import styles from "@/app/ui/starrating.module.css";

export default function DynamicStars({ onRatingChange, rating }: DynamicStarRatingProps) {

  const handleStarClick = (index: number) => {
    onRatingChange?.(index + 1);
  };

  return (
    <div className={styles.interactive}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`${styles.star} ${index < rating ? styles.filled : ''}`}
          onClick={() => handleStarClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
