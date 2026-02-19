'use client';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <p style={{ color: 'red', textAlign: 'center', padding: '10px' }}>
      {message}
    </p>
  );
}
