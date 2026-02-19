'use client';

import React, { useState } from 'react';
import styles from '@/app/ui/login_signup.module.css';
import { useRouter } from 'next/navigation';
import { createUser } from '@/app/lib/api';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userNameValid, setUserNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  const validateUserName = (userName: string) => {
    return userName.length >= 3 && userName.length <= 20;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    setUserNameValid(validateUserName(e.target.value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailValid(validateEmail(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isUserNameValid = validateUserName(userName);
    const isEmailValid = validateEmail(email);
    const isPasswordMatch = password === confirmPassword;

    setUserNameValid(isUserNameValid);
    setEmailValid(isEmailValid);
    setPasswordMatch(isPasswordMatch);
    setError('');

    if (isUserNameValid && isEmailValid && isPasswordMatch) {
      try {
        await createUser({
          first_name: firstName,
          last_name: lastName,
          username: userName,
          email: email,
          password: password,
        });
        alert("Sign up successful! Redirecting to login page...");
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign up failed. Please try again.';
        setError(message);
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formBox}>
        <h1 className={styles.formH1}>Food Journal</h1>
        <p className={styles.formP}>Already have an account? Click <a className={styles.formLink} href="/login">here</a> to login!</p>
        <h2 className={styles.formH2}>Sign Up</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.formLabel} htmlFor="firstName">First Name</label>
          <input
            className={styles.formInput}
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label className={styles.formLabel} htmlFor="lastName">Last Name</label>
          <input
            className={styles.formInput}
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <label className={styles.formLabel} htmlFor="userName">Username</label>
          <input
            className={styles.formInput}
            id="userName"
            type="text"
            value={userName}
            onChange={handleUserNameChange}
            required
          />
          {!userNameValid && <p className={styles.errorMessage}>Username must be between 3 to 20 characters long.</p>}
          <label className={styles.formLabel} htmlFor="email">Email</label>
          <input
            className={styles.formInput}
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {!emailValid && <p className={styles.errorMessage}>Invalid email address</p>}
          <label className={styles.formLabel} htmlFor="password">Password</label>
          <input
            className={styles.formInput}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className={styles.formLabel} htmlFor="confirmPassword">Confirm Password</label>
          <input
            className={styles.formInput}
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {!passwordMatch && <p className={styles.errorMessage}>Passwords do not match</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button className={styles.submit} type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
