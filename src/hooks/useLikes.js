import { useState, useEffect, useCallback } from 'react';
import { getPostLikes, getPostLikeCount, checkIfUserLiked, toggleLike } from '@/pages/admin/posts/api/LikesApi';

export const useLikes = (postId) => {
  const [likes, setLikes] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLikeData = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const [likesResponse, countResponse, likedResponse] = await Promise.all([
        getPostLikes(postId, 0, 10),
        getPostLikeCount(postId),
        checkIfUserLiked(postId),
      ]);

      const likesData = likesResponse.data || likesResponse;
      const countData = countResponse.data || countResponse;
      const likedData = likedResponse.data || likedResponse;

      setLikes(likesData.content || likesData.likes || []);
      setLikeCount(countData.count || countData || 0);
      setIsLiked(likedData.liked || likedData || false);
    } catch (err) {
      setError(err.message || 'Failed to fetch likes');
      console.error('Error fetching likes:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchLikeData();
  }, [fetchLikeData]);

  const togglePostLike = useCallback(async () => {
    try {
      await toggleLike(postId);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      await fetchLikeData();
    } catch (err) {
      setError(err.message || 'Failed to toggle like');
      throw err;
    }
  }, [postId, isLiked, likeCount, fetchLikeData]);

  return {
    likes,
    likeCount,
    isLiked,
    loading,
    error,
    fetchLikeData,
    togglePostLike,
  };
};
