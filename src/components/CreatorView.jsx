import { useState } from 'react';
import { api } from '../services/api';

export default function CreatorView({ onPhotoUploaded }) {
    const [formData, setFormData] = useState({
        title: '',
        caption: '',
        location: '',
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select an image file');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append('image', file);
            data.append('title', formData.title);
            data.append('caption', formData.caption);
            data.append('location', formData.location);

            await api.uploadPhoto(data);
            alert('Photo uploaded successfully!');
            onPhotoUploaded(); // Switch back to feed or refresh
        } catch (err) {
            setError('Failed to upload photo. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="creator-container">
            <h2>Upload New Photo</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label>📸 Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>📝 Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Give your photo a title"
                    />
                </div>

                <div className="form-group">
                    <label>💬 Caption</label>
                    <textarea
                        value={formData.caption}
                        onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                        placeholder="Write a caption..."
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label>📍 Location</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Add location"
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Uploading...' : 'Share Post'}
                </button>
            </form>
        </div>
    );
}
