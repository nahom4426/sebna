import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/constants/roles';

const Comments = () => {
  const auth = useAuthStore((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const userPrivileges = auth?.user?.privileges || [];

  const canCreate = userPrivileges.includes(ROLES.CREATE_COMMENT);
  const canDelete = userPrivileges.includes(ROLES.DELETE_COMMENT);
  const canRead = userPrivileges.includes(ROLES.READ_COMMENTS);

  const handleAddComment = () => {
    if (newComment.trim() && canCreate) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          text: newComment,
          author: auth?.user?.firstName || 'User',
          createdAt: new Date().toLocaleString(),
        },
      ]);
      setNewComment('');
    }
  };

  const handleDeleteComment = (id) => {
    if (canDelete) {
      setComments(comments.filter((comment) => comment.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Comments Management</h1>
          <p className="text-gray-600">Manage and moderate user comments</p>
        </div>

        {/* Create Comment Section */}
        {canCreate && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Comment</h2>
            <div className="flex gap-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
              />
              <button
                onClick={handleAddComment}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Post
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        {canRead ? (
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                <p className="text-gray-500 text-lg">No comments yet</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{comment.author}</p>
                      <p className="text-sm text-gray-500">{comment.createdAt}</p>
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">You don't have permission to view comments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
