'use client';

import styles from '@/app/ui/home.module.css';
import React, { useState, useEffect } from 'react';
import PostCard from '@/app/components/postcard';
import { PostListProps, DbPost } from '@/app/lib/definitions';



const PostList: React.FC<PostListProps> = ({ fetchUrl }) => {
  const [posts, setPosts] = useState<DbPost[]>([]);

  useEffect(() => {
    if (!fetchUrl) return;

    fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data: DbPost[]) => {
        setPosts(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [fetchUrl]);

  return (
    <div className={styles.postContainer}>
      {posts.length > 0 ? (
        posts.slice().reverse().map(post => (
          <PostCard
            key={post.id}
            id={post.id}
            user_id={post.user_id}
            username={post.username}
            profile_pic={post.profile_pic || '/blankProfile.png'}
            food_name={post.food_name}
            restaurant_name={post.restaurant_name || ''}
            rating={post.rating}
            review={post.review}
            image={post.image || '/noImage.png'}
            tags={post.tags}
          />
        ))
      ) : (
        <p className='text-gray-500'>No posts available.</p>
      )}
    </div>
  );
};

export default PostList;
