import api from './api';

const galleryService = {
  // GET /gallery - return array of images (controller exposes /api/gallery)
  getImages: async () => {
    try {
      const res = await api.get('/gallery');
      if (Array.isArray(res.data)) return res.data;
    } catch (e) {
      // on error return empty array
    }
    return [];
  },

  // POST /gallery - add image metadata (GalleryRequest JSON) as required by backend
  // payload should be an object like { imageUrl, caption }
  uploadImage: async (payload) => {
    // Only send imageUrl and caption
    const req = {
      imageUrl: payload.imageUrl,
      caption: payload.caption || ''
    };
    const res = await api.post('/gallery', req);
    return res.data;
  },


  // DELETE /gallery/:id - delete image by id (admin only)
  deleteImage: async (id) => {
    const res = await api.delete(`/gallery/${id}`);
    return res.data;
  }
};

export default galleryService;
