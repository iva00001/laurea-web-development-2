import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PostForm from '../components/PostForm.jsx'

function NewPostPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Handle form submission to create a new post
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // 1. Extract form values (using currentTarget is safer in React)
      const formData = new FormData(e.currentTarget) 
      const newPostData = Object.fromEntries(formData.entries())

      // 2. POST JSON body to /api/posts
      const response = await fetch('https://laurea-web-development-2-2.onrender.com/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPostData),
      })

      if (!response.ok) {
        // If server returns validation errors, read the message
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      // 3. On success, navigate to the new post's page
      const createdPost = await response.json()
      navigate(`/posts/${createdPost._id}`)
    } catch (err) {
      // 4. Show an error message on failure
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">New post</h1>
      {error && <p className="status-msg error">{error}</p>}
      <PostForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}

export default NewPostPage