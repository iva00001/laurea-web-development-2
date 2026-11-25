import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // 1. Fetch a single post when the page loads or id changes
  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`http://localhost:3000/api/posts/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) throw new Error('Post not found')
          throw new Error('Failed to fetch post')
        }
        
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  // 2. Delete the post and navigate back to the blog list
  async function handleDelete() {
    // Optional: Ask for confirmation before deleting
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      setDeleting(true)
      setError(null)

      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      // Navigate back to the blog page after successful deletion
      navigate('/blog')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  if (loading) return <p className="status-msg">Loading…</p>
  if (error && !post) return <p className="status-msg error">{error}</p>
  if (!post) return <p className="status-msg">Post not found.</p>

  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('fi-FI', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Date missing'

  return (
    <article className="post-detail">
      <div className="post-detail-meta">
        <span className="author">{post.author}</span>
        <time>{date}</time>
      </div>

      <h1 className="post-detail-title">{post.title}</h1>

      <p className="post-detail-content">{post.content}</p>

      {error && <p className="status-msg error" style={{ marginTop: '1rem' }}>{error}</p>}

      <div className="post-detail-actions">
        <Link to={`/posts/${id}/edit`} className="btn btn-secondary">
          Edit
        </Link>
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </article>
  )
}

export default PostPage