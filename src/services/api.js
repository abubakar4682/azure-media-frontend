const BASE_URL = 'https://azure-media-backend-fghgdrfacbafergt.canadacentral-01.azurewebsites.net';

export const api = {
    // Get all photos
    getPhotos: async () => {
        try {
            const response = await fetch(`${BASE_URL}/photos`);
            if (!response.ok) throw new Error('Failed to fetch photos');
            return await response.json();
        } catch (error) {
            console.error('Error fetching photos:', error);
            throw error;
        }
    },

    // Upload a new photo
    uploadPhoto: async (formData) => {
        try {
            const response = await fetch(`${BASE_URL}/photos`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to upload photo');
            return await response.json();
        } catch (error) {
            console.error('Error uploading photo:', error);
            throw error;
        }
    },

    // Get comments for a photo
    getComments: async (photoId) => {
        try {
            const response = await fetch(`${BASE_URL}/photos/${photoId}/comments`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    // Add a comment to a photo
    addComment: async (photoId, commentData) => {
        try {
            const response = await fetch(`${BASE_URL}/photos/${photoId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });
            if (!response.ok) throw new Error('Failed to add comment');
            return await response.json();
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    // Delete a photo
    deletePhoto: async (photoId) => {
        try {
            const response = await fetch(`${BASE_URL}/photos/${photoId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete photo');
            return true;
        } catch (error) {
            console.error('Error deleting photo:', error);
            throw error;
        }
    }
};
