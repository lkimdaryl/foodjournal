'use client';

import PostCard from '@/app/components/postcard';
import Loading from '@/app/components/loading';
import ErrorMessage from '@/app/components/errormessage';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DbPost } from '@/app/lib/definitions';
import cstyles from '@/app/ui/home.module.css';
import styles from '@/app/ui/user.module.css';
import Image from 'next/image';
import { fetchUserPosts } from '@/app/lib/api';

export default function MyPage() {
    const router = useRouter();
    const DefaultPic = '/blankProfile.png';
    const userId = Cookies.get('userId');

    const [allMyPosts, setAllMyPosts] = useState<DbPost[]>([]);
    const [profilePic, setProfilePic] = useState<string>(DefaultPic);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetchUserPosts(userId)
            .then(data => {
                if (data && data.length > 0) {
                    setAllMyPosts(data);
                    setProfilePic(data[0].profile_pic || DefaultPic);
                }
            })
            .catch(err => setError(err.message || 'Failed to load posts.'))
            .finally(() => setLoading(false));
    }, [userId]);

    useEffect(() => {
        const handlePostDeleted = (event: Event) => {
            const customEvent = event as CustomEvent;
            const deletedId = customEvent.detail?.id;
            setAllMyPosts((prevPosts) => prevPosts.filter(p => p.id !== deletedId));
        };
        window.addEventListener('postDeleted', handlePostDeleted);
        return () => window.removeEventListener('postDeleted', handlePostDeleted);
    }, []);

    if (loading) return <Loading message="Loading your posts..." />;
    if (error) return <ErrorMessage message={error} />;

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
