import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import Table from '../../../../components/Table';
import TableSkeletonRow from '../../../../components/TableSkeletonRow';
import Pagination from '../../../../composables/Pagination';
import MessagesDataProvider from '../component/MessagesDataProvider';
import MessageForm from '../component/MessageForm';
import { removeMessageById } from '../api/MessagesApi';

const Messages = () => {
  const { openModal } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const headers = {
    head: ['From', 'To', 'Message', 'Date', 'Actions'],
    row: ['senderName', 'receiverName', 'content', 'createdAt'],
  };

  const handleNewMessage = () => {
    openModal(
      <MessageForm
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    );
  };

  const handleDeleteMessage = async (msg) => {
    if (window.confirm('Delete this message?')) {
      try {
        const id = msg.messageId || msg.id;
        await removeMessageById(id);
        setRefreshKey((prev) => prev + 1);
      } catch (err) {
        console.error('Failed to delete message:', err);
        alert('Failed to delete message');
      }
    }
  };

  const renderRow = (row, index, page, perPage) => (
    <tr key={row.messageId || row.id || index} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-600 border-r border-gray-100">
        {(page - 1) * perPage + index + 1}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.senderName || row.sender?.firstName || row.senderId || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.receiverName || row.receiver?.firstName || row.receiverId || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100 truncate max-w-[200px]">
        {(row.content || '').slice(0, 60)}{(row.content || '').length > 60 ? '...' : ''}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
        <div className="flex gap-2">
          <button onClick={() => handleDeleteMessage(row)} className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </td>
    </tr>
  );

  const SkeletonRowComponent = () => (
    <TableSkeletonRow columns={3} withActions withIndex actionCount={1} />
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
          <button onClick={handleNewMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">+ New Message</button>
        </div>

        <MessagesDataProvider search={searchTerm} key={refreshKey}>
          {({ messages, pending, error, page, perPage, totalElements, totalPages, onPageChange, onPerPageChange, onNext, onPrevious }) => (
            <>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search messages..."
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
                rows={messages}
                loading={pending}
                renderRow={renderRow}
                page={page}
                perPage={perPage}
                placeholder="No messages found"
                SkeletonRow={SkeletonRowComponent}
                lastCol
              />

              {!pending && messages.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    perPage={perPage}
                    rowsCount={messages.length}
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
        </MessagesDataProvider>
      </div>
    </div>
  );
};

export default Messages;
