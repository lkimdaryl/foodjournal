import posts from '@/app/lib/posts.json';
import PostCard from '@/app/components/postcard';
import PostList from '@/app/components/postlist';
import styles from '@/app/ui/home.module.css';

export default function Home() {
    const allPosts = Object.values(posts).flat();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const fetchUrl = `${baseUrl}/api/v1/post_review/get_post_review`;

  return (
    <div className={styles.postContainer}>
      {allPosts.map((post, index) => (
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
      <PostList fetchUrl={fetchUrl} />
    </div>
  );
}
