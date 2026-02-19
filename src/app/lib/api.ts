import Cookies from 'js-cookie';
import { DbPost, ApiPayload, UserData } from '@/app/lib/definitions';
import { getDemoPosts, createDemoPost, updateDemoPost, deleteDemoPost } from '@/app/lib/demo';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function getToken(): string | undefined {
  return Cookies.get('access_token');
}

function isDemoUser(): boolean {
  return Cookies.get('user') === 'demo_guest';
}

function authHeaders(contentType?: string): HeadersInit {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${getToken()}`,
  };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }
  return response.json();
}

// ---- Auth ----

export async function loginUser(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  return request<{ access_token: string; user_id: string; profile_picture?: string }>(
    `${BASE_URL}/api/v1/auth/login`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    }
  );
}

export async function createUser(userData: {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}) {
  return request(`${BASE_URL}/api/v1/auth/create_user`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
}

export async function getUser(): Promise<UserData> {
  return request<UserData>(`${BASE_URL}/api/v1/auth/get_user`, {
    method: 'GET',
    headers: authHeaders(),
  });
}

export async function updateUser(data: Partial<UserData>) {
  return request(`${BASE_URL}/api/v1/auth/update_user`, {
    method: 'PATCH',
    headers: authHeaders('application/json'),
    body: JSON.stringify(data),
  });
}

// ---- Posts ----

export async function fetchAllPosts(): Promise<DbPost[]> {
  return request<DbPost[]>(`${BASE_URL}/api/v1/post_review/get_post_review`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function fetchUserPosts(userId: string | number): Promise<DbPost[]> {
  if (isDemoUser()) {
    return getDemoPosts('demo_guest');
  }
  return request<DbPost[]>(
    `${BASE_URL}/api/v1/post_review/get_posts_by_id?user_id=${userId}`,
    {
      method: 'GET',
      headers: { 'accept': 'application/json' },
    }
  );
}

export async function createPost(postData: {
  user_id: string | number;
  food_name: string;
  image: string;
  rating: number;
  restaurant_name: string;
  review: string;
  tags: string;
}): Promise<DbPost> {
  if (isDemoUser()) {
    const username = Cookies.get('user') || 'demo_guest';
    return createDemoPost(username, {
      user_id: -1,
      food_name: postData.food_name,
      image: postData.image,
      profile_pic: 'https://placehold.co/100',
      rating: postData.rating,
      restaurant_name: postData.restaurant_name,
      review: postData.review,
      tags: postData.tags,
      username,
    });
  }

  return request<DbPost>(`${BASE_URL}/api/v1/post_review/create_post_review`, {
    method: 'POST',
    headers: authHeaders('application/json'),
    body: JSON.stringify(postData),
  });
}

export async function updatePost(postId: number, postData: ApiPayload) {
  if (isDemoUser()) {
    const username = Cookies.get('user') || 'demo_guest';
    updateDemoPost(username, postId, postData);
    return;
  }

  const payload = { ...postData };
  delete payload.id;
  delete payload.profile_pic;
  delete payload.username;

  return request(`${BASE_URL}/api/v1/post_review/update_post_review?post_id=${postId}`, {
    method: 'PATCH',
    headers: authHeaders('application/json'),
    body: JSON.stringify(payload),
  });
}

export async function deletePost(postId: number | string) {
  if (isDemoUser()) {
    const username = Cookies.get('user') || 'demo_guest';
    deleteDemoPost(username, postId);
    return;
  }

  const userId = Cookies.get('userId');
  return request(`${BASE_URL}/api/v1/post_review/delete_post_review?post_id=${postId}&user_id=${userId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}
