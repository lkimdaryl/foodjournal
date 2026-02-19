import { DbPost } from '@/app/lib/definitions';

const STORAGE_KEY = 'myPosts';

function getAllDemoPosts(): { [key: string]: DbPost[] } {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDemoPosts(allPosts: { [key: string]: DbPost[] }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allPosts));
}

export function getDemoPosts(username: string): DbPost[] {
  const allPosts = getAllDemoPosts();
  return Array.isArray(allPosts[username]) ? allPosts[username] : [];
}

export function createDemoPost(username: string, post: Omit<DbPost, 'id'>): DbPost {
  const allPosts = getAllDemoPosts();
  if (!Array.isArray(allPosts[username])) {
    allPosts[username] = [];
  }

  const lastId = allPosts[username][allPosts[username].length - 1]?.id ?? -1;
  const newPost: DbPost = { ...post, id: lastId + 1 };
  allPosts[username].push(newPost);
  saveDemoPosts(allPosts);
  return newPost;
}

export function updateDemoPost(username: string, postId: number, updates: Partial<DbPost>): boolean {
  const allPosts = getAllDemoPosts();
  if (!Array.isArray(allPosts[username])) return false;

  const index = allPosts[username].findIndex(p => p.id === postId);
  if (index === -1) return false;

  allPosts[username][index] = { ...allPosts[username][index], ...updates };
  saveDemoPosts(allPosts);
  return true;
}

export function deleteDemoPost(username: string, postId: number | string): boolean {
  const allPosts = getAllDemoPosts();
  if (!Array.isArray(allPosts[username])) return false;

  const before = allPosts[username].length;
  allPosts[username] = allPosts[username].filter(p => p.id !== postId);
  saveDemoPosts(allPosts);
  return allPosts[username].length < before;
}
