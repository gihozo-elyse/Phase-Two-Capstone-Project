export interface User {
  id: string
  email: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  author_id: string
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  author?: User
  tags?: Tag[]
  _count?: {
    likes: number
    comments: number
  }
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface PostTag {
  post_id: string
  tag_id: string
}

export interface Comment {
  id: string
  content: string
  post_id: string
  author_id: string
  parent_id: string | null
  created_at: string
  updated_at: string
  author?: User
  replies?: Comment[]
}

export interface Like {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

