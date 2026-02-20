"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/ui/sidenav.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profilePicture, isDemoUser, logout } = useAuth();

  const handleLogout = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const access_token = document.cookie.match(/access_token=([^;]*)/)?.[1];

    try {
      await fetch(`${baseUrl}/api/v1/auth/logout`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${access_token}` },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    logout();
    router.push("/");
  };

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logoContainer}>
        <Image
          src='/foodjournal.png'
          alt='Food Journal Logo'
          width={100}
          height={100}
          className={styles.logo}
        />
      </Link>

      <ul className={styles.navList}>
        <li className={`${styles.navItem} ${pathname === "/" ? styles.selectedPage : ""}`}>
          <Link href="/" className={styles.navLink}>HOME</Link>
        </li>
        <li className={`${styles.navItem} ${pathname === "/recipes" ? styles.selectedPage : ""}`}>
          <Link href="/recipes" className={styles.navLink}>RECIPES</Link>
        </li>
        {user && !isDemoUser && (
          <li className={`${styles.navItem} ${pathname === "/settings" ? styles.selectedPage : ""}`}>
            <Link href="/settings" className={styles.navLink}>SETTINGS</Link>
          </li>
        )}
      </ul>

      {!user ? (
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/login" className={styles.loginSignupLink}>Login</Link>
            <Link href="/signup" className={styles.loginSignupLink}>Sign Up</Link>
          </li>
        </ul>
      ) : (
        <ul className={`${styles.navList} ${styles.profileContainer}`}>
          <li className={styles.navItem}>
            <Link href={isDemoUser ? "/user/demo" : "/user/mypage"} className={styles.navLink}>
              <Image
                src={profilePicture || "/blankProfile.png"}
                alt="Profile"
                className={styles.profileImg}
                width={100}
                height={100}
              />
              <p className={styles.profileName}>{user}</p>
            </Link>
          </li>
          <li className={styles.navItem}>
            <a onClick={handleLogout} className={styles.navLink}>Logout</a>
          </li>
        </ul>
      )}
    </nav>
  );
}
