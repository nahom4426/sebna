import { useState, useEffect, useCallback, useRef } from 'react';
import { getPostComments, createComment, updateCommentById, deleteCommentById } from '@/pages/admin/comments/api/CommentsApi';

export const useComments = (postId, page = 0, limit = 10) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchComments = useCallback(async () => {
    if (!postId || !isMountedRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getPostComments(postId, page, limit);
      if (!isMountedRef.current) return;
      const data = response.data || response;
      // Backend may return a pageable object ({content: []}) or a plain array ([])
      const list = Array.isArray(data) ? data : (data.content || data.comments || []);
      setComments(list);
      setTotalPages(Array.isArray(data) ? 1 : (data.totalPages || 0));
      setTotalElements(Array.isArray(data) ? list.length : (data.totalElements || 0));
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err.message || 'Failed to fetch comments');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [postId, page, limit]);

  useEffect(() => {
    fetchComments();
  }, [postId, page, limit]);

  const addComment = useCallback(async (comment) => {
    try {
      const response = await createComment({ postId, comment });
      const created = response.data || response;
      const newComment = Array.isArray(created) ? created[0] : created;
      if (newComment) {
        setComments([...comments, newComment]);
      }
      return newComment;
    } catch (err) {
      setError(err.message || 'Failed to create comment');
      throw err;
    }
  }, [postId, comments]);

  const updateComment = useCallback(async (id, content) => {
    try {
      const response = await updateCommentById(id, { comment: content });
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
