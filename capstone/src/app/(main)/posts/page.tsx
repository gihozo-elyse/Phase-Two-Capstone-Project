export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import PostCard from '@/components/post/PostCard';

async function getPosts() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const url = `${baseUrl}/api/posts?published=true&limit=20`;
    console.log('Fetching from:', url);
    
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Fetch failed:', res.status, errorText);
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">
            Explore Stories
          </h1>

          <div className="space-y-8">
            {posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No posts yet. Be the first to write something!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
