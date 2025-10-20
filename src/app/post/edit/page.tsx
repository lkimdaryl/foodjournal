'use client';

import styles from '@/app/ui/new_edit_post.module.css';
import DynamicStars from '@/app/components/dynamicstarrating';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ImageInput from "@/app/components/imgsrc";

export default function EditPost() {
    const router = useRouter();

    const [imageData, setImageData] = useState<string | null>(null);
    const postToEdit = localStorage.getItem('postToEdit');
    const post = postToEdit ? JSON.parse(postToEdit) : null;
    console.log(post);

    const [rating, setRating] = useState<number>(() => post?.rating || 0);

    function handleCancel(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        router.back();
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        const form = event.currentTarget.form;
        if (!form || !post) return;

        if (Cookies.get('user') === 'demo_guest') {
            const user = Cookies.get('user');
            const raw = localStorage.getItem('myPosts');

            let allPosts: { [key: string]: any[] } = {};
            try {
                allPosts = raw ? JSON.parse(raw) : {};
            } catch (e) {
                console.warn("Corrupted localStorage. Resetting.");
                allPosts = {};
            }

            if (!Array.isArray(allPosts[user!])) {
                allPosts[user!] = [];
            }

            const updatedPost = {
                ...post,
                food_name: form.mealName.value,
                image: imageData || "/noImage.png",
                rating: rating,
                restaurant_name: form.restaurant.value,
                review: form.comments.value,
                tags: form.tags.value,
            };

            // Find and update the post by unique_id
            const index = allPosts[user!].findIndex(p => p.id === post.id);
            if (index !== -1) {
                allPosts[user!][index] = updatedPost;
                localStorage.setItem('myPosts', JSON.stringify(allPosts));
            } else {
                console.warn("Post not found in localStorage.");
            }
            router.push('/user/demo'); // Redirect to the demo user page
        } else {
            const updatedPost = {
                ...post,
                user_id: Cookies.get('userId'),
                food_name: form.mealName.value,
                image: imageData || "/noImage.png",
                rating: rating,
                restaurant_name: form.restaurant.value,
                review: form.comments.value,
                tags: form.tags.value,
            };
            //not needed in the backend
            delete updatedPost.id;
            delete updatedPost.profile_pic;
            delete updatedPost.username;

            console.log(rating);
            console.log("Updated Post Data:", updatedPost);
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const access_token = Cookies.get('access_token');
            const url = `${baseUrl}/api/v1/post_review/update_post_review?post_id=${post.id}`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify(updatedPost),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Post updated successfully:', data);
                router.push('/user/mypage'); // Redirect to My Page after successful edit
            })
            .catch(error => {
                console.error('Error updating post:', error);
            });
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
                className={styles.entryInput}
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

            <div className={styles.formBttnContainer}>
                <button className={styles.formBttn} type="button" onClick={handleCancel}>Cancel</button>
                <button className={styles.formBttn} type="submit" onClick={handleSubmit}>Save Changes</button>
            </div>
        </form>
    );
}
