import { useState, useEffect, useCallback, useRef } from 'react';
import { getPostLikes, getPostLikeCount, checkIfUserLiked, toggleLike } from '@/pages/admin/posts/api/LikesApi';

export const useLikes = (postId) => {
  const [likes, setLikes] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchLikeData = useCallback(async () => {
    if (!postId || !isMountedRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const [likesResponse, countResponse, likedResponse] = await Promise.all([
        getPostLikes(postId, 0, 10),
        getPostLikeCount(postId),
        checkIfUserLiked(postId),
      ]);

      if (!isMountedRef.current) return;

      const likesData = likesResponse.data || likesResponse;
      const countData = countResponse.data || countResponse;
      const likedData = likedResponse.data || likedResponse;

      setLikes(likesData.content || likesData.likes || []);
      setLikeCount(
        typeof countData === 'number'
          ? countData
          : (countData?.likeCount ?? countData?.count ?? 0)
      );
      setIsLiked(typeof likedData.liked === 'boolean' ? likedData.liked : (typeof likedData === 'boolean' ? likedData : false));
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err.message || 'Failed to fetch likes');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [postId]);

  useEffect(() => {
    fetchLikeData();
  }, [fetchLikeData, postId]);

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
