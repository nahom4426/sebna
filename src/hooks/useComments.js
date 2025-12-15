import { useState, useEffect, useCallback } from 'react';
import { getPostComments, createComment, updateCommentById, deleteCommentById } from '@/pages/admin/comments/api/CommentsApi';

export const useComments = (postId, page = 0, limit = 10) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getPostComments(postId, page, limit);
      const data = response.data || response;
      setComments(data.content || data.comments || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, page, limit]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(async (content) => {
    try {
      const response = await createComment({ postId, content });
      const newComment = response.data || response;
      setComments([...comments, newComment]);
      return newComment;
    } catch (err) {
      setError(err.message || 'Failed to create comment');
      throw err;
    }
  }, [postId, comments]);

  const updateComment = useCallback(async (id, content) => {
    try {
      const response = await updateCommentById(id, { content });
      const updatedComment = response.data || response;
      setComments(comments.map((comment) => (comment.id === id ? updatedComment : comment)));
      return updatedComment;
    } catch (err) {
      setError(err.message || 'Failed to update comment');
      throw err;
    }
  }, [comments]);

  const deleteComment = useCallback(async (id) => {
    try {
      await deleteCommentById(id);
      setComments(comments.filter((comment) => comment.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
      throw err;
    }
  }, [comments]);

  return {
    comments,
    loading,
    error,
    totalPages,
    totalElements,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
  };
};
