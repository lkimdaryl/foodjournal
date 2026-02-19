'use client';

import styles from '@/app/ui/settings.module.css';
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import PostProfile from '@/app/components/postprofile';
import { UserData } from '@/app/lib/definitions';
import { getUser, updateUser } from '@/app/lib/api';
import { useAuth } from '@/app/lib/auth-context';

// ---------------- Custom Hook ----------------
function useUserData() {
  const initialStateRef = useRef<Partial<UserData>>({});
  const [user, setUser] = useState<Partial<UserData>>({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getUser()
      .then((data) => {
        initialStateRef.current = data;
        setUser(data);
      })
      .catch((err) => setFetchError(err.message || 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const resetUser = () => setUser(initialStateRef.current);

  return { user, setUser, resetUser, initialStateRef, loading, fetchError };
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

interface InputFieldConfig {
  label: string;
  name: keyof UserData | 'password' | 'verifyPassword';
  type?: string;
  error?: string;
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
  const { user, setUser, resetUser, initialStateRef, loading, fetchError } = useUserData();
  const { updateProfile } = useAuth();
  const [profileImage, setProfileImage] = useState<string>(DefaultPic);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [errors, setErrors] = useState({ email: '', verifyPassword: '' });

  useEffect(() => { if (user.profile_picture) setProfileImage(user.profile_picture); }, [user]);

  // ---------------- Handlers ----------------
  const handleChange = (field: string, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));

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
      await updateUser(updatedData);
      updateProfile({ username: user.username, profilePicture: profileImage });
      setIsReadOnly(true);
      initialStateRef.current = { ...initialStateRef.current, ...updatedData };
    } catch (err) {
      console.error(err);
      alert('Error updating user. Please try again.');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: '#636060' }}>Loading profile...</p>;
  if (fetchError) return <p style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{fetchError}</p>;

  const inputFields: (InputFieldConfig | null)[] = [
    { label: 'First Name', name: 'first_name' },
    { label: 'Last Name', name: 'last_name' },
    { label: 'Username', name: 'username' },
    { label: 'Email', name: 'email', type: 'email', error: errors.email },
    { label: isReadOnly ? 'Password' : 'New Password', name: 'password', type: 'password' },
    !isReadOnly ? { label: 'Verify Password', name: 'verifyPassword', type: 'password', error: errors.verifyPassword } : null
  ];

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
          {inputFields.filter((f): f is InputFieldConfig => f !== null).map((field) => (
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
