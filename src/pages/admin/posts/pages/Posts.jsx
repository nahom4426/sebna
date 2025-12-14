import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import Table from '../../../../components/Table';
import TableSkeletonRow from '../../../../components/TableSkeletonRow';
import Pagination from '../../../../composables/Pagination';
import PostsDataProvider from '../component/PostsDataProvider';
import PostForm from '../component/PostForm';
import { removePostById } from '../api/PostsApi';

const Posts = () => {
  const { openModal } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const headers = {
    head: ['Title', 'Institution', 'Status', 'Created', 'Actions'],
    row: ['title', 'institutionId', 'status', 'createdAt'],
  };

  const handleAddPost = () => {
    openModal(
      <PostForm
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    );
  };

  const handleEditPost = (post) => {
    openModal(
      <PostForm
        post={post}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    );
  };

  const handleDeletePost = async (post) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const id = post.postId || post.id;
        await removePostById(id);
        setRefreshKey((prev) => prev + 1);
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert('Failed to delete post');
      }
    }
  };

  const renderRow = (row, index, page, perPage) => (
    <tr key={row.postId || row.id || index} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-600 border-r border-gray-100">
        {(page - 1) * perPage + index + 1}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.title || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.institutionName || row.institution?.name || (row.institutionId ? row.institutionId : 'Public')}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.status || 'published'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
        <div className="flex gap-2">
          <button onClick={() => handleEditPost(row)} className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors">Edit</button>
          <button onClick={() => handleDeletePost(row)} className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </td>
    </tr>
  );

  const SkeletonRowComponent = () => (
    <TableSkeletonRow columns={3} withActions withIndex actionCount={2} />
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Posts Management</h1>
          <button onClick={handleAddPost} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">+ Add Post</button>
        </div>

        <PostsDataProvider search={searchTerm} key={refreshKey}>
          {({ posts, pending, error, page, perPage, totalElements, totalPages, onPageChange, onPerPageChange, onNext, onPrevious }) => (
            <>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {error && (
                <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>
              )}

              <Table
                headers={headers}
                rows={posts}
                loading={pending}
                renderRow={renderRow}
                page={page}
                perPage={perPage}
                placeholder="No posts found"
                SkeletonRow={SkeletonRowComponent}
                lastCol
              />

              {!pending && posts.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    perPage={perPage}
                    rowsCount={posts.length}
                    onPageChange={onPageChange}
                    onPerPageChange={onPerPageChange}
                    onNext={onNext}
                    onPrevious={onPrevious}
                    loading={pending}
                  />
                </div>
              )}
            </>
          )}
        </PostsDataProvider>
      </div>
    </div>
  );
};

export default Posts;
