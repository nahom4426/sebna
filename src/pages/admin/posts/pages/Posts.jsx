import React, { useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/constants/roles';
import { usePosts } from '@/hooks/usePosts';
import { useComments } from '@/hooks/useComments';
import { useLikes } from '@/hooks/useLikes';

const Posts = () => {
  const auth = useAuthStore((state) => state.auth);
  const [page, setPage] = useState(0);
  const { posts, loading, error, totalPages, createNewPost } = usePosts(page, 10);
  
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [newPostImageFile, setNewPostImageFile] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [creatingPost, setCreatingPost] = useState(false);
  const [postError, setPostError] = useState(null);

  const userPrivileges = auth?.user?.privileges || [];
  const canCreate = userPrivileges.includes(ROLES.CREATE_POST);
  const canUpdate = userPrivileges.includes(ROLES.UPDATE_POST);
  const canDelete = userPrivileges.includes(ROLES.DELETE_POST);
  const canLike = userPrivileges.includes(ROLES.LIKE_POST);
  const canComment = userPrivileges.includes(ROLES.CREATE_COMMENT);

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !canCreate) return;
    
    setCreatingPost(true);
    setPostError(null);
    try {
      await createNewPost({
        content: newPostContent,
        imageFile: newPostImageFile,
        institutionId: auth?.user?.institutionId,
      });
      setNewPostContent('');
      setNewPostImage(null);
      setNewPostImageFile(null);
    } catch (err) {
      setPostError(err.message || 'Failed to create post');
      console.error('Error creating post:', err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Posts Feed</h1>
          <p className="text-gray-600">Share updates with your community</p>
        </div>

        {/* Error Messages */}
        {(error || postError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
            {error || postError}
          </div>
        )}

        {/* Create Post Card */}
        {canCreate && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                👨‍💼
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1 px-4 py-3 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                disabled={creatingPost}
              />
            </div>

            {newPostImage && (
              <div className="mb-4 relative">
                <img
                  src={newPostImage}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  onClick={() => {
                    setNewPostImage(null);
                    setNewPostImageFile(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex gap-2 mb-4 border-t border-gray-200 pt-4">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors text-gray-700 font-medium disabled:opacity-50">
                <span>📷 Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={creatingPost}
                />
              </label>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 font-medium">
                😊 Feeling
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 font-medium">
                📍 Location
              </button>
            </div>

            <button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim() || creatingPost}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {creatingPost ? 'Posting...' : 'Post'}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Posts Feed */}
        {!loading && (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                canDelete={canDelete}
                canLike={canLike}
                canComment={canComment}
                expandedComments={expandedComments}
                toggleComments={toggleComments}
                newComments={newComments}
                setNewComments={setNewComments}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg mb-4">No posts yet</p>
            {canCreate && (
              <p className="text-gray-400">Be the first to share something!</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Post Card Component
const PostCard = ({
  post,
  canDelete,
  canLike,
  canComment,
  expandedComments,
  toggleComments,
  newComments,
  setNewComments,
}) => {
  const { comments, addComment } = useComments(post.id, 0, 5);
  const { isLiked, likeCount, togglePostLike } = useLikes(post.id);
  const [commentText, setCommentText] = useState('');
  const [addingComment, setAddingComment] = useState(false);

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
    if (!canLike) return;
    try {
      await togglePostLike();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
              👨‍💼
            </div>
            <div>
              <p className="font-bold text-gray-900">{post.user?.firstName || 'User'}</p>
              <p className="text-sm text-gray-500">
                {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}
              </p>
            </div>
          </div>
          {canDelete && (
            <button className="text-gray-500 hover:text-red-600 transition-colors">
              ⋯
            </button>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 py-4">
        <p className="text-gray-800 text-base leading-relaxed">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <img
          src={`data:image/jpeg;base64,${post.image}`}
          alt="Post"
          className="w-full h-96 object-cover"
        />
      )}

      {/* Post Stats */}
      <div className="px-6 py-3 border-t border-gray-100 flex justify-between text-sm text-gray-600">
        <span className="hover:underline cursor-pointer">👁️ {post.views || 0} views</span>
        <span className="hover:underline cursor-pointer">{likeCount} likes • {post.commentCount || 0} comments</span>
      </div>

      {/* Post Actions */}
      <div className="px-6 py-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={handleLike}
          disabled={!canLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-all ${
            isLiked
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'text-gray-600 hover:bg-gray-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLiked ? '❤️' : '🤍'} Like
        </button>
        <button
          onClick={() => toggleComments(post.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-all"
        >
          💬 Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-all">
          ↗️ Share
        </button>
      </div>

      {/* Comments Section */}
      {expandedComments[post.id] && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          {/* Existing Comments */}
          <div className="space-y-4 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm flex-shrink-0">
                  👤
                </div>
                <div className="flex-1 bg-white rounded-lg p-3">
                  <p className="font-semibold text-sm text-gray-900">{comment.user?.firstName || 'User'}</p>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          {canComment && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                👨‍💼
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={addingComment}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || addingComment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingComment ? '...' : 'Post'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
