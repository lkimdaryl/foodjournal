'use client';

import styles from '@/app/ui/new_edit_post.module.css';
import DynamicStars from '@/app/components/dynamicstarrating';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ImageInput from "@/app/components/imgsrc";
import { createPost } from '@/app/lib/api';

export default function NewPost() {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [imageData, setImageData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const isDemoUser = Cookies.get('user') === 'demo_guest';

    async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const form = event.currentTarget.form;
        if (!form) return;

        setSubmitting(true);
        setError(null);

        try {
            await createPost({
                user_id: Cookies.get('userId') || '-1',
                food_name: form.mealName.value,
                image: imageData || "/noImage.png",
                rating: rating,
                restaurant_name: form.restaurant.value,
                review: form.comments.value,
                tags: form.tags.value,
            });
            router.push(isDemoUser ? '/user/demo' : '/user/mypage');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create post.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    function handleCancel(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        window.history.back();
    }

    return (
        <form className={styles.newEntryForm}>
            <h1>New Entry</h1>
            <label className={styles.entryLabel} htmlFor="mealPics">Picture</label>
            <ImageInput onImageChange={setImageData} />

            <label className={styles.entryLabel} htmlFor="mealName">Meal Name</label>
            <input className={styles.entryInput} type="text" id="mealName" name="mealName" placeholder="Enter meal name" required/>

            <label className={styles.entryLabel} htmlFor="restaurant">Restaurant</label>
            <input className={styles.entryInput} type="text" id="restaurant" name="restaurant" placeholder="Enter restaurant" required/>

            <label className={styles.entryLabel} htmlFor='rating'>Rating</label>
            <DynamicStars onRatingChange={setRating} rating={rating}/>

            <label className={styles.entryLabel} htmlFor="comments">Comments</label>
            <textarea className={styles.comments} id="comments" name="comments" placeholder="Enter comments" required rows={4} cols={50}/>

            <label className={styles.entryLabel} htmlFor="tags">Tags</label>
            <input className={styles.entryInput} type="text" id="tags" name="tags" placeholder="Enter tags" required/>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className={styles.formBttnContainer}>
                <button className={styles.formBttn} type="button" onClick={handleCancel}>Cancel</button>
                <button className={styles.formBttn} type="submit" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    );
}
