import styles from '@/app/ui/postdetail.module.css';
import { useRouter } from 'next/navigation';
import StaticStarRating from '@/app/components/staticstarrating';
import PostProfile from '@/app/components/postprofile';
import Cookies from 'js-cookie';
import { Post, PostDetailProps } from '@/app/lib/definitions';
import Image from 'next/image';

export default function PostDetail({ post, onClose }: PostDetailProps) {
    if (!post) return null;

    const router = useRouter();
    console.log(post);
    console.log(Cookies.get('user'));
    const myPage = Cookies.get('user') === post.username? true : false;

    function handleDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();

        if (post.username === 'demo_guest') {
            if (window.confirm("Are you sure you want to delete this post?")) {
                const stored = localStorage.getItem('myPosts');
                if (!stored) return;

                const parsedPosts: { [username: string]: Post[] } = JSON.parse(stored);
                console.log(parsedPosts);
                for (const user in parsedPosts) {
                    parsedPosts[user] = parsedPosts[user].filter(p => p.id !== post.id);
                }

                localStorage.setItem('myPosts', JSON.stringify(parsedPosts));
                window.dispatchEvent(new Event("postDeleted")); // Trigger re-render

                onClose();
            }
        } else {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const fetchUrl = `${baseUrl}/api/v1/post_review/delete_post_review?post_id=${post.id}`;
            try {
                fetch(fetchUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('access_token')}`,
                    }})
            } catch (error) {
                console.error('Error deleting post:', error);
            }

            onClose();

            const event = new CustomEvent('postDeleted', { detail: { id: post.id } });
            window.dispatchEvent(event);

        }
    }

    function handleEdit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        localStorage.setItem('postToEdit', JSON.stringify(post));
        router.push('/post/edit');
    }

    return (
        <div className={styles.reviewDetailContainer}>
            <div className={styles.reviewDetailHeader}>
                <PostProfile username={post.username} profilePic={post.profile_pic} />
                <button className={styles.closeButton} onClick={onClose}>X</button>
            </div>
            {post.image && post.image.trim() !== '' && 
                <Image 
                    className={styles.foodPic}
                    src={post.image || "noImage.png"} 
                    alt={`Picture of ${post.food_name}`}
                    width={300}
                    height={300}
                />
            }
            <div className={styles.foodDetailContainer}>
                <h1 className={styles.foodName}>{post.food_name}</h1>
                <div className={styles.starRating}>
                    <StaticStarRating rating={post.rating} />
                </div>
                {post.review && post.review.trim() !== '' && <p className={styles.detailText}>{post.review}</p>}
                {post.restaurant_name && post.restaurant_name.trim() !== '' && <p className={styles.detailText}><strong>Restaurant:</strong> {post.restaurant_name}</p>}
                {post.tags && post.tags.trim() !== '' && <p className={styles.detailText}><strong>Tags:</strong> {post.tags}</p>}
                { myPage? 
                    <div className={styles.postBttnContainer}>
                        <button className={styles.postButton}
                            onClick={handleEdit}>Edit</button>
                        <button className={styles.postButton}
                            onClick={handleDelete}>Delete</button>
                    </div> : <div></div>
                }
            </div>
        </div>
    )
};
