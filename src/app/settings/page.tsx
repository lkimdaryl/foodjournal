'use client';

import styles from '@/app/ui/settings.module.css';
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Cookies from 'js-cookie';
import PostProfile from '@/app/components/postprofile';
import { UserData } from '@/app/lib/definitions';

// ---------------- Custom Hook ----------------
function useUserData(url: string) {
  const initialStateRef = useRef<Partial<UserData>>({});
  const [user, setUser] = useState<Partial<UserData>>({});
  console.log(url);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(url, { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: UserData = await res.json();
        initialStateRef.current = data;
        setUser(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetchUser();
  }, [url]);

  const resetUser = () => setUser(initialStateRef.current);

  return { user, setUser, resetUser, initialStateRef };
}

// ---------------- Input Component ----------------
interface InputFieldProps {
  label: string;
  name: keyof UserData | 'password' | 'verifyPassword';
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
  error?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label, name, type = 'text', value, onChange, readOnly, error, placeholder
}) => (
  <div>
    <label htmlFor={name}><h4>{label}</h4></label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={styles.formControl}
    />
    {error && <output className={styles.output}>{error}</output>}
  </div>
);

// ---------------- Main Component ----------------
export default function EditProfile() {
  const DefaultPic = '/blankProfile.png';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const access_token = Cookies.get('access_token');
  const { user, setUser, resetUser, initialStateRef } = useUserData(`${baseUrl}/api/v1/auth/get_user`);
  const [profileImage, setProfileImage] = useState<string>(DefaultPic);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [errors, setErrors] = useState({ email: '', verifyPassword: '' });

  // Update profile image when user changes
  useEffect(() => { if (user.profile_picture) setProfileImage(user.profile_picture); }, [user]);

  // ---------------- Handlers ----------------
  const handleChange = (field: string, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));

    // Simple validation
    if (field === 'email') {
      setErrors(prev => ({
        ...prev,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address',
      }));
    } else if (field === 'verifyPassword') {
      setErrors(prev => ({
        ...prev,
        verifyPassword: value === (user.password || '') ? '' : 'Passwords do not match',
      }));
    }
  };

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => reader.result && setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleEdit = () => setIsReadOnly(false);
  const handleCancel = () => { setIsReadOnly(true); resetUser(); setProfileImage(initialStateRef.current.profile_picture || DefaultPic); };

  const handleSubmit = async () => {
    if (errors.email || errors.verifyPassword) return;

    const updatedData: Partial<UserData> = {};
    Object.keys(user).forEach(key => {
      if (user[key as keyof UserData] !== initialStateRef.current[key as keyof UserData]) {
        updatedData[key as keyof UserData] = user[key as keyof UserData];
      }
    });
    if (profileImage !== initialStateRef.current.profile_picture) updatedData.profile_picture = profileImage;

    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/update_user`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('access_token')}` 
      },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('User could not be updated.');
      Cookies.set('user', user.username || '');
      Cookies.set('profilePicture', profileImage);
      window.dispatchEvent(new Event('userInfoUpdated'));
      setIsReadOnly(true);
      initialStateRef.current = { ...initialStateRef.current, ...updatedData };
    } catch (err) {
      console.error(err);
      alert('Error updating user. Please try again.');
    }
  };

  const inputFields = [
    { label: 'First Name', name: 'first_name' },
    { label: 'Last Name', name: 'last_name' },
    { label: 'Username', name: 'username' },
    { label: 'Email', name: 'email', type: 'email', error: errors.email },
    { label: isReadOnly ? 'Password' : 'New Password', name: 'password', type: 'password' },
    !isReadOnly ? { label: 'Verify Password', name: 'verifyPassword', type: 'password', error: errors.verifyPassword } : null
  ]

  // ---------------- Render ----------------
  return (
    <div className={styles.profilePage}>
      <div className={styles.profileSettings}>
        <PostProfile username={user.username || ''} profilePic={profileImage} size="200px" />
        {!isReadOnly && (
          <>
            <label htmlFor="file-upload" className={`${styles.customUploadBtn} ${styles.actionButton}`}>Change Profile Picture</label>
            <input id="file-upload" type="file" accept="image/png, image/jpeg" onChange={handlePictureChange} className={styles.hiddenFileInput} />
          </>
        )}
      </div>

      <form className={styles.registrationForm}>
        <div className={styles.inputSection}>
          {inputFields.filter(Boolean).map((field: any) => (
            <InputField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={user[field.name as keyof UserData] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              readOnly={isReadOnly}
              error={field.error}
            />
          ))}
        </div>

        <div className={styles.buttonSection}>
          <button type="button" onClick={isReadOnly ? handleEdit : handleSubmit} className={`${styles.submitButton} ${styles.actionButton}`} disabled={!!errors.email || !!errors.verifyPassword}>
            {isReadOnly ? 'Edit' : 'Save'}
          </button>
          {!isReadOnly && <button type="button" className={styles.actionButton} onClick={handleCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}