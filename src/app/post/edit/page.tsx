'use client';

import styles from '@/app/ui/new_edit_post.module.css';
import DynamicStars from '@/app/components/dynamicstarrating';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ImageInput from "@/app/components/imgsrc";
import { DbPost } from '@/app/lib/definitions';
import { updatePost } from '@/app/lib/api';

export default function EditPost() {
    const router = useRouter();
    const [post, setPost] = useState<DbPost | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const isDemoUser = Cookies.get('user') === 'demo_guest';

    useEffect(() => {
        if (typeof window === "undefined") return;
        const postToEdit = localStorage.getItem('postToEdit');
        if (postToEdit) {
            try {
                const parsedPost: DbPost = JSON.parse(postToEdit);
                setPost(parsedPost);
                setRating(parsedPost.rating || 0);
                setImageData(parsedPost.image || null);
            } catch (e) {
                console.error("Failed to parse postToEdit:", e);
            }
        }
    }, []);

    function handleCancel(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        router.back();
    }

    async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const form = event.currentTarget.form;
        if (!form || !post) return;

        setSubmitting(true);
        setError(null);

        const updatedPost = {
            ...post,
            food_name: form.mealName.value,
            image: imageData || post.image || "/noImage.png",
            rating: rating,
            restaurant_name: form.restaurant.value,
            review: form.comments.value,
            tags: form.tags.value,
            user_id: Number(Cookies.get('userId')) || post.user_id,
        };

        try {
            await updatePost(post.id, updatedPost);
            router.push(isDemoUser ? '/user/demo' : '/user/mypage');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update post.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className={styles.newEntryForm}>
            <h1>Edit Entry</h1>

            <label className={styles.entryLabel} htmlFor="mealPics">Picture</label>
            <ImageInput onImageChange={setImageData} initialImage={post?.image}/>

            <label className={styles.entryLabel} htmlFor="mealName">Meal Name</label>
            <input
                className={styles.entryInput}
                type="text"
                id="mealName"
                name="mealName"
                defaultValue={post?.food_name}
                required
            />

            <label className={styles.entryLabel} htmlFor="restaurant">Restaurant</label>
            <input
                className={styles.entryInput}
                type="text"
                id="restaurant"
                name="restaurant"
                defaultValue={post?.restaurant_name}
                required
            />

            <label className={styles.entryLabel} htmlFor='rating'>Rating</label>
            <DynamicStars onRatingChange={setRating} rating={rating} />

            <label className={styles.entryLabel} htmlFor="comments">Comments</label>
            <textarea
                className={styles.comments}
                id="comments"
                name="comments"
                defaultValue={post?.review}
                required
                rows={4}
                cols={50}
            />

            <label className={styles.entryLabel} htmlFor="tags">Tags</label>
            <input
                className={styles.entryInput}
                type="text"
                id="tags"
                name="tags"
                defaultValue={post?.tags}
                required
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className={styles.formBttnContainer}>
                <button className={styles.formBttn} type="button" onClick={handleCancel}>Cancel</button>
                <button className={styles.formBttn} type="submit" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
