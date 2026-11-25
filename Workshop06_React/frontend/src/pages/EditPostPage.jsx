import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PostForm from '../components/PostForm.jsx'

// TODO (student): Implement edit flow.
// Suggested steps:
// 1) Fetch existing post with GET /api/posts/:id.
// 2) Pass fetched data to PostForm as initialData.
// 3) On submit, send PUT /api/posts/:id.
// 4) Navigate back to /posts/:id after successful save.
function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // TODO (student): Replace this placeholder with GET /api/posts/:id fetch logic.
    setLoading(false)
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    // TODO (student): Implement PUT /api/posts/:id.
    setError('TODO: implement PUT /api/posts/:id in EditPostPage')
    setSubmitting(false)
  }

  if (loading) return <p className="status-msg">Loading…</p>
  if (error && !post) return <p className="status-msg error">{error}</p>
  if (!post) return <p className="status-msg">TODO: Load a post before editing.</p>

  return (
    <div>
      <h1 className="page-title">Edit post</h1>
      {error && <p className="status-msg error">{error}</p>}
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