import styles from '@/app/ui/postprofile.module.css'
import { usePathname, useRouter } from 'next/navigation';
import { PostProfileProps } from '@/app/lib/definitions';
import Image from 'next/image';
import { useAuth } from '@/app/lib/auth-context';

export default function PostProfile({profilePic, username, postUserId, currentUserId}: PostProfileProps) {

    const currentPath = usePathname();
    const router = useRouter();
    const { isDemoUser } = useAuth();

    const handleUsernameClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (currentPath === '/settings') {
            return;
        }

        if (isDemoUser || username === "demo_guest") {
            router.push("/user/demo");
        } else if (Number(postUserId) === Number(currentUserId)) {
            router.push("/user/mypage");
        } else {
            const params = new URLSearchParams();
            if (profilePic) params.set('pic', profilePic);
            if (postUserId) params.set('uid', String(postUserId));
            router.push(`/user/${username}?${params.toString()}`);
        }
    };

    return (
    <div className={styles.profileSection} onClick={handleUsernameClick} >
        <Image
            src={profilePic || '/blankProfile.png'}
            alt="Profile Picture"
            width={200}
            height={200}
            className={styles.profilePic}
            />
        <p className={styles.username}>{username}</p>
    </div>
  )
}
