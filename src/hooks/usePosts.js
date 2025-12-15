import { useState, useEffect, useCallback } from 'react';
import { getAllPosts, getPostById, createPost, updatePostById, removePostById } from '@/pages/admin/posts/api/PostsApi';

export const usePosts = (page = 0, limit = 10) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllPosts(page, limit);
      const data = response.data || response;
      setPosts(data.content || data.posts || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createNewPost = useCallback(async (postData) => {
    try {
      const response = await createPost(postData);
      const newPost = response.data || response;
      setPosts([newPost, ...posts]);
      return newPost;
    } catch (err) {
      setError(err.message || 'Failed to create post');
      throw err;
    }
  }, [posts]);

  const updatePost = useCallback(async (id, postData) => {
    try {
      const response = await updatePostById(id, postData);
      const updatedPost = response.data || response;
      setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
      return updatedPost;
    } catch (err) {
      setError(err.message || 'Failed to update post');
      throw err;
    }
  }, [posts]);

  const deletePost = useCallback(async (id) => {
    try {
      await removePostById(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      throw err;
    }
  }, [posts]);

  return {
    posts,
    loading,
    error,
    totalPages,
    totalElements,
    fetchPosts,
    createNewPost,
    updatePost,
    deletePost,
  };
};
