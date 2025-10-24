"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import styles from "@/app/ui/sidenav.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUserName] = useState<string | undefined>(() => Cookies.get("user"));
  const [profilePic, setProfilePic] = useState<string | undefined>(() => Cookies.get("profilePicture") || "/blankProfile.png");

  const performLocalLogout = () => {
    Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));
    localStorage.clear();
    setUserName(undefined);
    setProfilePic("/blankProfile.png");
  };
  
  const handleLogout = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const access_token = Cookies.get("access_token");
    const url = `${baseUrl}/api/v1/auth/logout`;
    
    try {
      await fetch(url, { 
        method: "POST",
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    performLocalLogout();
    router.push("/");
  };

  useEffect(() => {
    const handleUserInfoUpdate = () => {
      setUserName(Cookies.get("user"));
      setProfilePic(Cookies.get("profilePicture") || "/blankProfile.png");
    };

    window.addEventListener("userInfoUpdated", handleUserInfoUpdate);

    return () => {
      window.removeEventListener("userInfoUpdated", handleUserInfoUpdate);
    };
  }, []);
  
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logoContainer}>
        <Image
          src='/logo.png'
          alt='Food Journal Logo'
          width={100}
          height={100}
          className={styles.logo}
        />
        <p className={styles.logoText}>Food Journal</p>
      </Link>

      <ul className={styles.navList}>
        <li
          className={`${styles.navItem} ${
            pathname === "/" ? styles.selectedPage : ""
          }`}
        >
          <Link href="/" className={styles.navLink}>
            HOME
          </Link>
        </li>
        <li
          className={`${styles.navItem} ${
            pathname === "/recipes" ? styles.selectedPage : ""
          }`}
        >
          <Link href="/recipes" className={styles.navLink}>
            RECIPES
          </Link>
        </li>
        {username && username != 'demo_guest' && (
          <li
            className={`${styles.navItem} ${
              pathname === "/settings" ? styles.selectedPage : ""
            }`}
          >
            <Link href="/settings" className={styles.navLink}>
              SETTINGS
            </Link>
          </li>
        )}
      </ul>

      {!username ? (
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/login" className={styles.loginSignupLink}>
              Login
            </Link>
            <Link href="/signup" className={`${styles.loginSignupLink} text-sm`} >
              Sign Up
            </Link>
          </li>
        </ul>
      ) : (
        <ul className={`${styles.navList} ${styles.profileContainer}`}>
          <li className={styles.navItem}>
            <Link
              href={username === "demo_guest" ? "/user/demo" : "/user/mypage"}
              className={styles.navLink}
            >
              <Image
                src={profilePic || "/blankProfile.png"}
                alt="Profile"
                className={styles.profileImg}
                width={100}
                height={100}
              />
              <p className={styles.profileName}>{username}</p>
            </Link>
          </li>
          <li className={styles.navItem}>
            <a onClick={handleLogout} className={styles.navLink}>
              Logout
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}
