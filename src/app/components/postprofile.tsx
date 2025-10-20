import styles from '@/app/ui/postprofile.module.css'
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { PostProfileProps } from '@/app/lib/definitions';
import Image from 'next/image';

export default function PostProfile({profilePic, username, postUserId, currentUserId}: PostProfileProps) {

    const currentPath = usePathname();
    const router = useRouter();    

    const handleUsernameClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        Cookies.set('username', username);
        Cookies.set("profilePic", profilePic || '/blankProfile.png');
        Cookies.set("postUserId", String(postUserId));
        Cookies.set("currentUserId", String(currentUserId));
        
        if (currentPath === '/settings') {
            return;
        }

        if (username === "demo_guest") {
            router.push("/user/demo");
        }else if (Number(postUserId) === Number(currentUserId)) {
            router.push("/user/mypage");
        }else{
            router.push(`/user/${username}`);
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