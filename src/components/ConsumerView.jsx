import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const ConsumerView = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const data = await api.getPhotos();
            setPhotos(data);
        } catch (err) {
            setError('Failed to load feed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading feed...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="photo-grid">
            {photos.length === 0 && <p>No photos yet.</p>}
            {photos.map(photo => (
                <PhotoCard key={photo.id} photo={photo} />
            ))}
        </div>
    );
};

const PhotoCard = ({ photo }) => {
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    const toggleComments = async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const data = await api.getComments(photo.id);
                setComments(data);
            } catch {
                alert('Failed to load comments');
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const added = await api.addComment(photo.id, newComment);
            setComments([...comments, added]);
            setNewComment('');
        } catch {
            alert('Failed to post comment');
        }
    };

    return (
        <div className="photo-card">
            <img
                src={photo.image_url}
                alt={photo.title}
                className="photo-image"
            />

            <h3>{photo.title}</h3>
            <p>{photo.caption}</p>
            <small>{photo.location}</small>

            <button onClick={toggleComments}>
                {showComments ? 'Hide Comments' : 'View Comments'}
            </button>

            {showComments && (
                <div className="comments">
                    {loadingComments && <p>Loading comments...</p>}

                    {comments.map(c => (
                        <p key={c.id}>
                            💬 {c.comment_text}
                        </p>
                    ))}

                    <form onSubmit={handleAddComment}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button type="submit">Post</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ConsumerView;
