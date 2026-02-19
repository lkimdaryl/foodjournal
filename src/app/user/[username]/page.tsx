'use client';

import PostList from '@/app/components/postlist';
import styles from '@/app/ui/user.module.css';
import cstyles from '@/app/ui/home.module.css';
import { useParams, useSearchParams } from 'next/navigation';
import demoPosts from '@/app/lib/posts.json';
import PostCard from '@/app/components/postcard';
import Image from 'next/image';

export default function UserPage() {
    const { username } = useParams() as { username: string };
    const searchParams = useSearchParams();
    const profilePic = searchParams.get('pic') || '/blankProfile.png';
    const postUserId = searchParams.get('uid');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const fetchUrl = postUserId
        ? `${baseUrl}/api/v1/post_review/get_posts_by_id?user_id=${postUserId}`
        : undefined;

    const userDemoPosts = (demoPosts as Record<string, typeof demoPosts[keyof typeof demoPosts]>)[username] || [];

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
                <span>{username}</span>
            </div>
            {userDemoPosts.map((post, index) => (
                <PostCard
                    key={index}
                    id={index}
                    user_id={index}
                    username={post.username}
                    profile_pic={post.profile_pic || '/blankProfile.png'}
                    food_name={post.food_name}
                    rating={post.rating}
                    review={post.review}
                    image={post.image}
                    tags={post.tags}
                    restaurant_name={post.restaurant_name}
                />
            ))}
            {fetchUrl && <PostList fetchUrl={fetchUrl} />}
        </div>
    );
}
