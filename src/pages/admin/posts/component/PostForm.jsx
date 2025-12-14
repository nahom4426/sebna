import React, { useEffect, useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { createPost, updatePostById } from '../api/PostsApi';
import { getAllInstitution } from '../../institutions/api/InstitutionsApi';

const PostForm = ({ post = null, onSuccess }) => {
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [institutions, setInstitutions] = useState([]);

  const isEditMode = Boolean(post && (post.postId || post.id));

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    institutionId: '', // optional; empty => Super Admin/public post
    status: 'published',
    imageFile: null,
  });

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const res = await getAllInstitution({ page: 1, size: 100 });
        if (res.success) {
          const data = res.data?.response || res.data?.content || [];
          setInstitutions(data);
        }
      } catch (e) {
        console.error('Failed to load institutions', e);
      }
    };
    loadInstitutions();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        institutionId: post.institutionId || '',
        status: post.status || 'published',
        imageFile: null,
      });
      if (post.image) setImagePreview(post.image);
    }
  }, [isEditMode, post]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleImageFile = (file) => {
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Image must be PNG, JPEG, JPG, GIF, SVG, or WEBP format');
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image file size must be less than 5MB');
      return;
    }
    setFormData((prev) => ({ ...prev, imageFile: file }));
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setSuccess('Image attached');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setFormData((prev) => ({ ...prev, imageFile: null }));
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        const id = post.postId || post.id;
        await updatePostById(id, formData);
      } else {
        await createPost(formData);
      }
      setSuccess(isEditMode ? 'Post updated successfully' : 'Post created successfully');
      setTimeout(() => {
        closeModal();
        onSuccess && onSuccess();
      }, 1200);
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} post`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">{isEditMode ? 'Edit Post' : 'Create Post'}</h2>

      {error && (
        <div className="p-3 mb-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>
      )}
      {success && (
        <div className="p-3 mb-3 rounded bg-green-50 text-green-700 border border-green-200">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            maxLength={255}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border rounded min-h-[120px]"
            maxLength={5000}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Institution (optional)</label>
          <select
            value={formData.institutionId}
            onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Super Admin (Public)</option>
            {institutions.map((inst) => (
              <option key={inst.institutionId || inst.id} value={inst.institutionId || inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image (optional)</label>
          {imagePreview ? (
            <div className="space-y-2">
              <img src={imagePreview} alt="Preview" className="w-full max-h-56 object-cover rounded" />
              <button type="button" onClick={removeImage} className="px-3 py-1 text-sm bg-gray-200 rounded">Remove</button>
            </div>
          ) : (
            <input type="file" accept="image/*" onChange={handleFileChange} />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
