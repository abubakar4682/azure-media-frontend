import { useState } from 'react';
import { api } from '../services/api';

export default function PhotoCard({ photo, onDelete }) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(photo.comments || []);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Parse location if it's stored as JSON string, otherwise use as is
    const getLocationString = (loc) => {
        if (!loc) return '';
        try {
            const parsed = JSON.parse(loc);
            return parsed.name || parsed;
        } catch {
            return loc;
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            const newComment = {
                text: comment,
                user: 'Anonymous', // Simplified for this requirements
                timestamp: new Date().toISOString()
            };

            // Optimistic update
            const tempId = Date.now();
            setComments([...comments, { ...newComment, id: tempId }]);
            setComment('');

            await api.addComment(photo.id, newComment);
            // In a real app we'd replace the optimistic one with the real one from server
        } catch (error) {
            console.error('Failed to add comment', error);
            alert('Failed to post comment');
            // Revert optimistic update ideally
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this photo?')) return;

        setDeleting(true);
        try {
            await api.deletePhoto(photo.id);
            if (onDelete) onDelete(photo.id);
        } catch (error) {
            console.error('Failed to delete photo', error);
            alert('Failed to delete photo. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <article className={`photo-card ${deleting ? 'deleting' : ''}`}>
            <header className="card-header">
                <div className="user-info">
                    <span className="username">azure_user</span>
                    {photo.location && <span className="location">{getLocationString(photo.location)}</span>}
                </div>
                <button
                    className="delete-btn"
                    onClick={handleDelete}
                    disabled={deleting}
                    title="Delete photo"
                >
                    {deleting ? '...' : '✕'}
                </button>
            </header>

            <div className="card-image">
                <img src={photo.image_url || photo.url} alt={photo.title} loading="lazy" />
            </div>

            <div className="card-content">
                <div className="actions">
                    <button className="icon-btn">❤️</button>
                    <button className="icon-btn">💬</button>
                    <button className="icon-btn">🚀</button>
                </div>

                <h3 className="photo-title">{photo.title}</h3>
                {photo.caption && <p className="caption"><span className="username">azure_user</span> {photo.caption}</p>}

                <div className="comments-section">
                    {comments.map((c, i) => (
                        <div key={c.id || i} className="comment">
                            <span className="username">{c.user || 'User'}</span> {c.text}
                        </div>
                    ))}
                </div>

                <form className="comment-form" onSubmit={handleAddComment}>
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={submitting || deleting}
                    />
                    <button type="submit" disabled={!comment.trim() || submitting || deleting}>Post</button>
                </form>
            </div>
        </article>
    );
}
