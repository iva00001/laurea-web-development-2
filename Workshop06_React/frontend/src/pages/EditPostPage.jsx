import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PostForm from '../components/PostForm.jsx'

function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // 1. Fetch the existing post when the page loads
  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`http://localhost:3000/api/posts/${id}`)
        if (!response.ok) {
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

  // 2. Send the updated data to the server when the form is submitted
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Extract data from the form (using currentTarget is safer in React)
      const formData = new FormData(e.currentTarget) // <-- ИЗМЕНЕНО ЗДЕСЬ
      const updatedData = Object.fromEntries(formData.entries())

      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        // If the server returns an error (e.g., text is too short), read the message
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update post')
      }

      // 3. If successful, navigate back to the post's view page
      navigate(`/posts/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="status-msg">Loading…</p>
  if (error && !post) return <p className="status-msg error">{error}</p>
  if (!post) return <p className="status-msg">Post not found.</p>

  return (
    <div>
      <h1 className="page-title">Edit post</h1>
      {error && <p className="status-msg error">{error}</p>}
      
      {/* Pass the fetched post data into the form */}
      <PostForm
        key={post._id}
        initialData={post}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  )
}

export default EditPostPage