import React, { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/constants/roles';
import { usePosts } from '@/hooks/usePosts';
import { useComments } from '@/hooks/useComments';
import { useLikes } from '@/hooks/useLikes';
import { isSuperAdmin } from '@/utils/rbacUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiImage, 
  FiSmile, 
  FiMapPin, 
  FiHeart, 
  FiMessageCircle, 
  FiShare2, 
  FiMoreVertical,
  FiSend,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiCamera,
  FiUser
} from 'react-icons/fi';
import { 
  FcComments, 
  FcLike, 
  FcShare, 
  FcPicture, 
  FcAddDatabase,
  FcDeleteDatabase,
  FcVideoCall
} from 'react-icons/fc';

// Glass Card Component
const GlassCard = ({ children, className = '', hover = true }) => (
  <motion.div 
    className={`relative bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden ${className}`}
    whileHover={hover ? { scale: 1.01, y: -2 } : {}}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-5 rounded-3xl" />
    <div className="absolute inset-[1px] bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl rounded-3xl" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

// Category Badge Component
const CategoryBadge = ({ category }) => {
  const categoryColors = {
    investment: 'from-blue-500 to-cyan-500',
    market: 'from-purple-500 to-pink-500',
    company: 'from-green-500 to-emerald-500',
  };
  
  const categoryLabels = {
    investment: 'Investment',
    market: 'Market',
    company: 'Company',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${categoryColors[category] || 'from-gray-500 to-gray-600'} text-white text-xs font-semibold`}>
      {categoryLabels[category] || category}
    </span>
  );
};

// Loading Skeleton Component
const PostSkeleton = () => (
  <GlassCard className="p-6 mb-6" hover={false}>
    <div className="animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-64 bg-gray-200 rounded-xl"></div>
    </div>
  </GlassCard>
);

// Post Card Component
const PostCard = ({
  post,
  canDelete,
  canLike,
  canComment,
  expandedComments,
  toggleComments,
}) => {
  const { comments, addComment } = useComments(post.id, 0, 5);
  const { isLiked, likeCount, togglePostLike } = useLikes(post.id);
  const [commentText, setCommentText] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleAddComment = async () => {
    if (!commentText.trim() || !canComment) return;
    setAddingComment(true);
    try {
      await addComment(commentText);
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setAddingComment(false);
    }
  };

  const handleLike = async () => {
    if (!canLike || isLiking) return;
    setIsLiking(true);
    try {
      await togglePostLike();
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <GlassCard className="p-6 mb-6">
      {/* Post Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
              {post.user?.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">{post.user?.firstName || 'User'} {post.user?.lastName || ''}</h3>
              <span className="text-xs text-gray-500">•</span>
              <CategoryBadge category={post.category} />
            </div>
            <p className="text-sm text-gray-500">
              {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}
            </p>
          </div>
        </div>
        {canDelete && (
          <motion.button 
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMoreVertical className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        {post.title && (
          <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
        )}
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.imageBase64 && (
        <motion.div 
          className="mb-4 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={post.imageBase64.startsWith('data:') ? post.imageBase64 : `data:image/jpeg;base64,${post.imageBase64}`}
            alt="Post"
            className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      )}

      {/* Post Stats */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <FcLike className="w-4 h-4" />
          <span>{likeCount} likes</span>
        </motion.div>
        <motion.button 
          onClick={() => toggleComments(post.id)}
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FcComments className="w-4 h-4" />
          <span>{post.commentCount || 0} comments</span>
        </motion.button>
        <div className="flex items-center gap-2">
          <FcPicture className="w-4 h-4" />
          <span>{post.views || 0} views</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex gap-2 mb-4 border-t border-gray-100 pt-4">
        <motion.button
          onClick={handleLike}
          disabled={!canLike || isLiking}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
            isLiked
              ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600'
              : 'text-gray-600 hover:bg-gray-50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLiking ? (
            <FiRefreshCw className="w-4 h-4 animate-spin" />
          ) : isLiked ? (
            <FiHeart className="w-4 h-4 fill-current" />
          ) : (
            <FiHeart className="w-4 h-4" />
          )}
          Like
        </motion.button>
        
        <motion.button
          onClick={() => toggleComments(post.id)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiMessageCircle className="w-4 h-4" />
          Comment
        </motion.button>
        
        <motion.button 
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiShare2 className="w-4 h-4" />
          Share
        </motion.button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {expandedComments[post.id] && (
          <motion.div 
            className="border-t border-gray-100 pt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Existing Comments */}
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-2">
              {comments.map((comment) => (
                <motion.div 
                  key={comment.id} 
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {comment.user?.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-sm text-gray-900">{comment.user?.firstName || 'User'}</p>
                      <p className="text-xs text-gray-500">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add Comment */}
            {canComment && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {post.user?.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-sm transition-all duration-300"
                    disabled={addingComment}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <motion.button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || addingComment}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {addingComment ? (
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiSend className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

const Posts = () => {
  const auth = useAuthStore((state) => state.auth);
  const [page, setPage] = useState(0);
  const institutionId = auth?.user?.institutionId || auth?.user?.institutionUuid;
  const { posts, loading, error, totalPages, createNewPost } = usePosts(page, 10, institutionId);
  
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [newPostImageFile, setNewPostImageFile] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [creatingPost, setCreatingPost] = useState(false);
  const [postError, setPostError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const userPrivileges = auth?.user?.privileges || [];
  const canCreate = userPrivileges.includes(ROLES.CREATE_POST);
  const canUpdate = userPrivileges.includes(ROLES.UPDATE_POST);
  const canDelete = userPrivileges.includes(ROLES.DELETE_POST);
  const canLike = userPrivileges.includes(ROLES.LIKE_POST);
  const canComment = userPrivileges.includes(ROLES.CREATE_COMMENT);

  const roleName = auth?.user?.roleName;
  const mustHaveInstitution = !isSuperAdmin(roleName);
  const institutionMissing = mustHaveInstitution && !institutionId;

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory || !canCreate) return;

    if (institutionMissing) {
      setPostError('You are not assigned to an institution');
      return;
    }
    
    setCreatingPost(true);
    setPostError(null);
    try {
      await createNewPost({
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        imageFile: newPostImageFile,
        institutionId,
      });
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('');
      setNewPostImage(null);
      setNewPostImageFile(null);
    } catch (err) {
      setPostError(err.message || 'Failed to create post');
    } finally {
      setCreatingPost(false);
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId],
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPostError('Image size must be less than 5MB');
        return;
      }
      setNewPostImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-cyan-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center md:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Community Feed
          </h1>
          <p className="text-gray-600 text-lg">Share ideas, discuss topics, and connect with others</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl text-gray-700 focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm"
              >
                <option value="all">All Categories</option>
                <option value="investment">Investment</option>
                <option value="market">Market</option>
                <option value="company">Company</option>
              </select>
              <motion.button 
                className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-2xl text-gray-700 hover:bg-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiFilter className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Error Messages */}
        <AnimatePresence>
          {(error || postError) && (
            <motion.div 
              className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl text-red-600 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">!</span>
                </div>
                <div>
                  <p className="font-semibold">{error || postError}</p>
                  <p className="text-sm text-red-500 mt-1">Please try again</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Post Card */}
        {canCreate && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              {institutionMissing && (
                <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl text-yellow-800 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">!</span>
                    </div>
                    <div>
                      <p className="font-semibold">Institution Required</p>
                      <p className="text-sm text-yellow-700">You need to be assigned to an institution to create posts</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  {auth?.user?.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Post Title"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-400 font-semibold text-lg transition-all duration-300"
                    disabled={creatingPost || institutionMissing}
                  />
                </div>
              </div>

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-400 resize-none mb-4 transition-all duration-300"
                rows="4"
                disabled={creatingPost || institutionMissing}
              />

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300"
                  disabled={creatingPost || institutionMissing}
                >
                  <option value="">Select Category</option>
                  <option value="investment">Investment News</option>
                  <option value="market">Market News</option>
                  <option value="company">Company News</option>
                </select>
                
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 cursor-pointer transition-all duration-300 text-gray-700 font-medium disabled:opacity-50">
                  <FiCamera className="w-5 h-5" />
                  <span>Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={creatingPost || institutionMissing}
                  />
                </label>
              </div>

              {newPostImage && (
                <motion.div 
                  className="mb-4 relative rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={newPostImage}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <motion.button
                    onClick={() => {
                      setNewPostImage(null);
                      setNewPostImageFile(null);
                    }}
                    className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <motion.button 
                    className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={creatingPost || institutionMissing}
                  >
                    <FiSmile className="w-5 h-5" />
                  </motion.button>
                  <motion.button 
                    className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={creatingPost || institutionMissing}
                  >
                    <FiMapPin className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <motion.button
                  onClick={handleCreatePost}
                  disabled={institutionMissing || !newPostTitle.trim() || !newPostContent.trim() || !newPostCategory || creatingPost}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="relative flex items-center gap-2">
                    {creatingPost ? (
                      <>
                        <FiRefreshCw className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        Create Post
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Posts Feed */}
        {!loading && (
          <AnimatePresence>
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostCard
                    post={post}
                    canDelete={canDelete}
                    canLike={canLike}
                    canComment={canComment}
                    expandedComments={expandedComments}
                    toggleComments={toggleComments}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="p-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                <FcComments className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterCategory !== 'all' 
                  ? 'No posts match your search criteria' 
                  : 'Be the first to share something with the community!'}
              </p>
              {canCreate && !institutionMissing && (
                <motion.button
                  onClick={() => {
                    document.querySelector('textarea')?.focus();
                    setSearchQuery('');
                    setFilterCategory('all');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create First Post
                </motion.button>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div 
            className="mt-8 flex justify-center items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiChevronLeft className="w-5 h-5" />
              Previous
            </motion.button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (page < 3) {
                  pageNum = i;
                } else if (page > totalPages - 4) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-xl font-semibold ${
                      page === pageNum
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {pageNum + 1}
                  </motion.button>
                );
              })}
            </div>
            
            <motion.button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
              <FiChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Posts;