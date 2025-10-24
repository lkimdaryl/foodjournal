'use client';

import styles from '@/app/ui/new_edit_post.module.css'
import DynamicStars from '@/app/components/dynamicstarrating'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ImageInput from "@/app/components/imgsrc";
import { DbPost } from '@/app/lib/definitions';


export default function NewPost() {
    const router = useRouter();

    const [rating, setRating] = useState(0);
    const [imageData, setImageData] = useState<string | null>(null);

    const access_token = Cookies.get('access_token');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}/api/v1/post_review/create_post_review`;


    function handleCancel(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        window.history.back();
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        const form = event.currentTarget.form;
        if (!form) return;

        if (Cookies.get('user') == 'demo_guest') {
            const user = Cookies.get('user');
            const raw = localStorage.getItem('myPosts');

            let allPosts: { [key: string]: DbPost[] } = {};
            try {
                allPosts = raw ? JSON.parse(raw) : {};
            } catch (e) {
                console.warn("Corrupted localStorage. Resetting.");
                allPosts = {};
                console.error(e);
            }

            if (typeof user !== 'string') {
                console.warn("User is undefined or not a string, cannot index allPosts.");
                return;
            }
            
            if (!Array.isArray(allPosts[user])) {
                console.warn(`allPosts[${user}] was not an array. Resetting to [].`, allPosts[user]);
                allPosts[user] = [];
            }

            const last_id = allPosts[user][allPosts[user].length - 1]?.id;
            const newPost = {
                id: last_id? last_id + 1 : 0,
                user_id: -1,
                food_name: form.mealName.value,
                image: imageData || "/noImage.png",
                profile_pic: "https://placehold.co/100",
                rating: rating,
                restaurant_name: form.restaurant.value,
                review: form.comments.value,
                tags: form.tags.value,
                username: user,
            };


            allPosts[user].push(newPost);

            // Step 4: Save everything back
            localStorage.setItem('myPosts', JSON.stringify(allPosts));
            router.push('/user/demo');
        } else {
            const postData = {
                user_id: Cookies.get('userId'),
                food_name: form.mealName.value,
                image: imageData || "/noImage.png",
                rating: rating,
                restaurant_name: form.restaurant.value,
                review: form.comments.value,
                tags: form.tags.value,
            };
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify(postData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                console.log('Post created successfully');
                router.push('/user/mypage');
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
        }
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
        
        <div className={styles.formBttnContainer}>
            <button className={styles.formBttn} type="button" onClick={handleCancel}>Cancel</button>
            <button className={styles.formBttn} type="submit" onClick={handleSubmit}>Submit</button>
        </div>
    </form>)
}