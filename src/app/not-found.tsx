'use client';

import Link from 'next/link';
import styles from '@/app/ui/home.module.css'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center w-full p-4 text-gray-500">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go back home
      </Link>
    </div>
  );
}
