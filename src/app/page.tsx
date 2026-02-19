import styles from '@/app/ui/home.module.css';
import PostList from './components/postlist';

export default function Home() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}/api/v1/post_review/get_post_review`;

  return (
    <div className={styles.postContainer}>
      <PostList fetchUrl={url} />
    </div>
  );
}
