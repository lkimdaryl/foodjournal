'use client';

import styles from '@/app/ui/home.module.css';
import React, { useState, useEffect } from 'react';
import defPosts from '@/app/lib/posts.json';
import PostCard from '@/app/components/postcard';
import Loading from '@/app/components/loading';
import { PostListProps, DbPost } from '@/app/lib/definitions';
import { fetchAllPosts } from '@/app/lib/api';

const PostList: React.FC<PostListProps> = ({ fetchUrl }) => {
  const defaultPosts = Object.values(defPosts).flat();
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fetchUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetchAllPosts()
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  if (loading) return <Loading message="Loading posts..." />;

  const displayPosts: Partial<DbPost>[] = posts.length > 0 ? posts : defaultPosts;

  return (
    <div className={styles.postContainer}>
      {displayPosts.slice().reverse().map((post, index) => (
        <PostCard
          key={post.id ?? index}
          id={post.id ?? index}
          user_id={post.user_id ?? index}
          username={post.username || ''}
          profile_pic={post.profile_pic || '/blankProfile.png'}
          food_name={post.food_name}
          restaurant_name={post.restaurant_name || ''}
          rating={post.rating ?? 0}
          review={post.review}
          image={post.image || '/noImage.png'}
          tags={post.tags}
        />
      ))}
    </div>
  );
};

export default PostList;
