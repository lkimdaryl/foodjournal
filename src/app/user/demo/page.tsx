'use client';

import cstyles from '@/app/ui/home.module.css';
import styles from '@/app/ui/user.module.css';
import myPostsData from '@/app/lib/demoposts.json';
import PostCard from '@/app/components/postcard';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DbPost, PostsType } from '@/app/lib/definitions'


const myPosts: PostsType = Object.fromEntries(
    Object.entries(myPostsData).map(([username, posts]) => [
        username,
        posts.map((post, index) => ({
            id: index,
            user_id: -1,
            username: post.username,
            profile_pic: post.profile_pic,
            food_name: post.food_name,
            restaurant_name: post.restaurant_name,
            rating: post.rating,
            review: post.review,
            image: post.image,
            tags: Array.isArray(post.tags)
                ? post.tags.join(', ')
                : typeof post.tags === 'string'
                ? post.tags.trim()
                : '',
        })),
    ])
);


export default function DemoUserPage() {
    const router = useRouter();
    const signedIn = Cookies.get('signedIn') === 'true';
    const DefaultPic = '/blankProfile.png';

    useEffect(() => {
        if (!localStorage.getItem('myPosts')) {
            const postsWithId: Record<string, DbPost[]> = {};
            
            for (const user in myPosts) {
            postsWithId[user] = myPosts[user].map(post => ({
                ...post,
            }));
        }

        localStorage.setItem('myPosts', JSON.stringify(postsWithId));
            localStorage.setItem('myPosts', JSON.stringify(myPosts));
        }
    }, []);

    const [allMyPosts, setAllMyPosts] = useState<DbPost[]>([]);

    const loadPosts = () => {
        const storedPosts = localStorage.getItem('myPosts');
        if (storedPosts) {
            const parsedPosts = JSON.parse(storedPosts) as Record<string, DbPost[]>;; 
            setAllMyPosts(Object.values(parsedPosts).flat());
        }
    };

    useEffect(() => {
        loadPosts();
        
        const handlePostDeleted = () => {
            loadPosts(); // 🔁 Refresh when postDeleted is triggered
        };

        window.addEventListener('postDeleted', handlePostDeleted);
        
        return () => {
            window.removeEventListener('postDeleted', handlePostDeleted);
        };
    }, []);


    return (
        <div className={cstyles.postContainer}>
            <div className={styles.profileSection}>
                <img className={styles.profilePic} src={DefaultPic} alt="Profile" />
                <span>{myPosts["demo_guest"][0].username}</span>
            </div>
            {allMyPosts.map((food, index) => (
                <PostCard
                    key={index}
                    id={food.id}
                    user_id={food.user_id}
                    username={food.username}
                    profile_pic={DefaultPic}
                    food_name={food.food_name}
                    rating={food.rating}
                    review={food.review}
                    image={food.image} 
                    tags={food.tags} 
                    restaurant_name={food.restaurant_name}
                    />
            ))}
            <button className={styles.newPostButton} onClick={() => router.push('/post/new')}>+</button>
        </div>
    );
}

