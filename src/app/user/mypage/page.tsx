'use client';

import PostCard from '@/app/components/postcard';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DbPost } from '@/app/lib/definitions';
import cstyles from '@/app/ui/home.module.css';
import styles from '@/app/ui/user.module.css';
import Image from 'next/image';

export default function MyPage() {
    const router = useRouter();
    const DefaultPic = '/blankProfile.png';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const fetchUrl = `${baseUrl}/api/v1/post_review/get_posts_by_id?user_id=${Cookies.get('userId')}`;

    const [allMyPosts, setAllMyPosts] = useState<DbPost[]>([]);
    const [profilePic, setProfilePic] = useState<string>(DefaultPic);

    useEffect(() => {
        if (allMyPosts.length > 0) return; // Avoid fetching if posts are already loaded

        // fetchPosts
        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                setAllMyPosts([]);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                setAllMyPosts(data);
                setProfilePic(data[0].profile_pic || DefaultPic);
                console.log(data);
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
    }, [allMyPosts.length, fetchUrl]);

    useEffect(() => {
        const handlePostDeleted = (event: Event) => {
            const customEvent = event as CustomEvent;
            const deletedId = customEvent.detail?.id;
            setAllMyPosts((prevPosts) => prevPosts.filter(p => p.id !== deletedId));
        };
        window.addEventListener('postDeleted', handlePostDeleted);

        return () => {
            window.removeEventListener('postDeleted', handlePostDeleted);
        };
    }, []);

    return (
        <div className={cstyles.postContainer}>
            <div className={styles.profileSection}>
                <Image
                    src={profilePic}
                    alt="Profile Picture"
                    width={200}
                    height={200}
                    className={styles.profilePic}
                />
                <span>{Cookies.get('user')}</span>
            </div>
            {allMyPosts.map((post, index) => (
                <PostCard
                    key={index}
                    id={post.id}
                    user_id={post.user_id}
                    username={post.username}
                    profile_pic={profilePic}
                    food_name={post.food_name}
                    rating={post.rating}
                    review={post.review}
                    image={post.image} 
                    tags={post.tags} 
                    restaurant_name={post.restaurant_name} />
            ))}
            <button className={styles.newPostButton} onClick={() => router.push('/post/new')}>+</button>
        </div>
    );
}

