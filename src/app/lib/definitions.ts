export interface PostCardProps {
    id : number | string;
    user_id: number;
    username: string;
    profile_pic?: string;
    food_name?: string;
    restaurant_name?: string;
    rating: number;
    review?: string;
    image?: string;
    tags?: string | undefined;
}

export interface Post {
    id : number | string;
    user_id: number;
    username: string;
    profile_pic?: string;
    food_name?: string;
    restaurant_name?: string;
    rating: number;
    review?: string;
    image?: string;
    tags?: string;
    unique_id?: string;
}

export interface PostDetailProps {
    post: Post;
    onClose: () => void;
    onDelete?: (id: string) => void;

}

export interface PostProfileProps {
    username: string;
    profilePic?: string;
    size?: string; // Optional size prop for profile picture
    postUserId?: string | number;
    currentUserId?: string | number;
}

export interface StaticStarRatingProps {
    rating: number;
}

export interface DynamicStarRatingProps {
  onRatingChange?: (rating: number) => void;
  rating: number; // Optional initial rating
};

export interface DbPost {
  id : number;
  user_id: number;
  username: string;
  profile_pic?: string;
  food_name?: string;
  restaurant_name?: string;
  rating: number;
  review?: string;
  image?: string;
  tags?: string;
}

export interface PostListProps {
  fetchUrl?: string;
  isUserPage?: boolean;
  username?: string;
  profilePic?: string;
  userId?: string | number | null;
}

export type ImgSrcProps = {
  onImageChange: (base64Image: string | null) => void;
  initialImage?: string | null;
};

export interface pastaProps {
  img: string;
  label: string;
  url: string;
}

export interface recipeProps {
  uri: string;
  url: string;
  img: string;
  label: string;
}

export interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  password?: string;
  email: string;
  profile_picture: string;
  detail?: string;
}

export type PostsType = {
    [username: string]: DbPost[];
};