import styles from '@/app/ui/postdetail.module.css';
import { useRouter } from 'next/navigation';
import StaticStarRating from '@/app/components/staticstarrating';
import PostProfile from '@/app/components/postprofile';
import Cookies from 'js-cookie';
import { PostDetailProps } from '@/app/lib/definitions';
import { deletePost } from '@/app/lib/api';
import Image from 'next/image';

export default function PostDetail({ post, onClose }: PostDetailProps) {
    const router = useRouter();

    if (!post) return null;
    const myPage = Cookies.get('user') === post.username;

    async function handleDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();

        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await deletePost(post.id as number);
            const customEvent = new CustomEvent('postDeleted', { detail: { id: post.id } });
            window.dispatchEvent(customEvent);
            onClose();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
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
                { myPage ?
                    <div className={styles.postBttnContainer}>
                        <button className={styles.postButton} onClick={handleEdit}>Edit</button>
                        <button className={styles.postButton} onClick={handleDelete}>Delete</button>
                    </div> : <div></div>
                }
            </div>
        </div>
    )
}
