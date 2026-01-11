import { useEffect, useState } from 'react';
import { api } from '../services/api';
import PhotoCard from './PhotoCard';

export default function PhotoGrid() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getPhotos();
            // Sort by ID or date descending if backend doesn't
            const sortedPhotos = Array.isArray(data) ? [...data].sort((a, b) => b.id - a.id) : [];
            setPhotos(sortedPhotos);
        } catch (err) {
            setError('Failed to load feed. The backend might be waking up (Cold Start).');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoDeleted = (photoId) => {
        setPhotos(photos.filter(p => p.id !== photoId));
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading your feed...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                <p>{error}</p>
                <button className="retry-btn" onClick={loadPhotos}>Retry</button>
            </div>
        );
    }

    return (
        <div className="photo-grid-container">
            <div className="photo-grid">
                {photos.map(photo => (
                    <PhotoCard
                        key={photo.id}
                        photo={photo}
                        onDelete={handlePhotoDeleted}
                    />
                ))}
            </div>
            {photos.length === 0 && (
                <div className="empty-state">
                    <p>No photos yet. Be the first to post!</p>
                </div>
            )}
        </div>
    );
}
