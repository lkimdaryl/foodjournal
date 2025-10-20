'use client';

import styles from '@/app/ui/login_signup.module.css';
import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    usernameInputRef.current?.focus();
  }, []);

  const loginEvent = ((path: string) => {
    Cookies.set('signedIn', 'true'); // in case user sign as demo_guest
    Cookies.set('user', username);  // in case user sign as demo_guest
    const event = new Event("userInfoUpdated");
    window.dispatchEvent(event);
    router.push(path);
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo credentials
    if (username === "demo_guest" && password === "password123") {
      alert("This is a demo user. No posts will truly be saved or edited.")
      loginEvent('/user/demo');
    } 
    else {
      const formData = new URLSearchParams();
      console.log("Attempting login with:", { username, password });
      formData.append("username", username);
      formData.append("password", password);
      
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const url = `${baseURL}/api/v1/auth/login`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString(),
        });
        console.log(response)
        const data = await response.json();
        
        if (response.ok) {
          Cookies.set("access_token", data.access_token, {path: "/"});
          Cookies.set("signedIn", "true", { path: "/" });
          Cookies.set("user", username, { path: "/" });
          Cookies.set("userId", data.user_id, { path: "/" });
          Cookies.set("profilePicture", data.profile_picture ?? "/blankProfile.png"), { path: "/" };
          loginEvent('/user/mypage');
        } else {
          setError('Invalid username or password.');
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
    setLoading(false);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formBox}>
        <h1 className={styles.formH1}>Food Journal</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.formLabel} htmlFor="username">Username</label>
          <input
            className={styles.formInput}
            id="username"
            type="text"
            value={username}
            placeholder='demo username: demo_guest'
            onChange={(e) => setUsername(e.target.value)}
            required
            />
          <label className={styles.formLabel} htmlFor="password">Password</label>
          <input
            className={styles.formInput}
            id="password"
            type="password"
            value={password}
            placeholder="demo password: password123"
            onChange={(e) => setPassword(e.target.value)}
            required
            />
          <div className={styles.errorMessage}>{error}</div>
          <button className={styles.submit} disabled={loading}>{loading ? 'Loggin in...' : 'Login'}</button>
          <a className={styles.forgot} href="https://youtu.be/b3rNUhDqciM">Forgot Password?</a>
          <p className={styles.notice}>New to Food Journal?</p>
          <a className={styles.signupLink} href='/signup'>Sign up for free</a>
        </form>
      </div>
    </div>
  );
}
