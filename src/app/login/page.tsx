'use client';

import styles from '@/app/ui/login_signup.module.css';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/lib/api';
import { useAuth } from '@/app/lib/auth-context';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    usernameInputRef.current?.focus();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (username === "demo_guest" && password === "password123") {
      alert("This is a demo user. No posts will truly be saved or edited.");
      login({ username });
      router.push('/user/demo');
    } else {
      try {
        const data = await loginUser(username, password);
        login({
          username,
          userId: data.user_id,
          profilePicture: data.profile_picture ?? "/blankProfile.png",
          accessToken: data.access_token,
        });
        router.push('/user/mypage');
      } catch {
        setError('Invalid username or password.');
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
            ref={usernameInputRef}
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
          <button className={styles.submit} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          <a className={styles.forgot} href="https://youtu.be/b3rNUhDqciM">Forgot Password?</a>
          <p className={styles.notice}>New to Food Journal?</p>
          <a className={styles.signupLink} href='/signup'>Sign up for free</a>
        </form>
      </div>
    </div>
  );
}
