import styles from '@/app/ui/starrating.module.css'
import { StaticStarRatingProps } from '@/app/lib/definitions';

export default function StaticStarRating({ rating }: StaticStarRatingProps) {
    const totalStars = 5;
    return(
        <div className={styles.starRating}>
            {Array.from({ length: totalStars }, (_, i) => (
            <span key={i} className={`${styles.star} ${i < rating ? styles.filled : ""}`}>&#9733;</span>
            ))}
      </div>
    );
}