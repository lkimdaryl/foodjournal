'use client';

import styles from '@/app/ui/postcard.module.css';
import { useState } from 'react';
import { PostCardProps } from '@/app/lib/definitions';
import StaticStarRating from '@/app/components/staticstarrating';
import PostDetail from '@/app/components/postdetail';
import PostProfile from '@/app/components/postprofile';
import { useAuth } from '@/app/lib/auth-context';
import Image from 'next/image';

export default function PostCard({
    id,
    user_id,
    username,
    profile_pic,
    food_name,
    restaurant_name,
    rating,
    review,
    image,
    tags,
    } : PostCardProps) {

    const [showPostDetail, setPostDetail] = useState<boolean>(false);
    const { userId } = useAuth();

    return (
        <>
        {showPostDetail ?
            <PostDetail
                post={{
                    id,
                    user_id,
                    username,
                    profile_pic,
                    food_name,
                    rating,
                    review,
                    image,
                    restaurant_name,
                    tags,
                }}
                onClose={() => setPostDetail(false)}
            />
            :
            <div className={styles.minPostContainer}>
                <PostProfile
                    profilePic={profile_pic || '/blankProfile.png'}
                    username={username}
                    postUserId={user_id}
                    currentUserId={userId}
                />
                <div className={styles.contentSection} onClick={() => setPostDetail(true)}>
                    <Image
                        className={styles.minPostImage}
                        alt={`Picture of ${food_name}`}
                        src={image && image.trim() !== "" ? image : "/noImage.png"}
                        height={300}
                        width={300}
                        loading='lazy'
                    />
                    <p className={styles.mealName}>{food_name}</p>
                    <StaticStarRating rating={rating} />
                    <p className={styles.review}>{review}</p>
                </div>
            </div>
        }
        </>
    );
}
