import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard.jsx'

function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('http://localhost:3000/api/posts')
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, []) 

  if (loading) return <p className="status-msg">Loading posts…</p>
  if (error) return <p className="status-msg error">Error: {error}</p>

  return (
    <div className="blog-page">
      <div className="page-heading">
        <p className="eyebrow">Blog</p>
        <h1 className="page-title">All posts</h1>
        <p className="page-copy">
          Latest posts from our community.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="status-msg">No posts yet. Create one!</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post._id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HomePage