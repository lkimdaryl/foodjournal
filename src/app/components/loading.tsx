'use client';

export default function Loading({ message = 'Loading...' }: { message?: string }) {
  return (
    <p style={{ color: '#636060', textAlign: 'center', padding: '20px' }}>
      {message}
    </p>
  );
}
