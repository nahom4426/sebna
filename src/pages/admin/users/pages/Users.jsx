import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { Button, Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import Table from '../../../../components/Table';
import TableSkeletonRow from '../../../../components/TableSkeletonRow';
import Pagination from '../../../../composables/Pagination';
import UsersDataProvider from '../component/UsersDataProvider';
import UserForm from '../component/UserForm';
import { adminResetPassword, removeUserById, resendWelcomePasswordEmail } from '../api/UsersApi';
import { toast } from '@/utils/utils';
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/constants/roles';

const Users = () => {
  const { openModal } = useModal();
  const auth = useAuthStore((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [queuedEmailBanner, setQueuedEmailBanner] = useState('');

  const roleNameRaw = auth?.user?.roleName;
  const roleNameNormalized = String(roleNameRaw || '').trim().toLowerCase().replace(/\s+/g, '_');
  const isCompanyAdmin = roleNameNormalized === 'company_admin';
  const institutionId = auth?.user?.institutionId || auth?.user?.institutionUuid;
  const institutionMissing = isCompanyAdmin && !institutionId;

  const userPrivileges = auth?.user?.privileges || [];
  const canCreateUser = userPrivileges.includes(ROLES.CREATE_USER);
  const canUpdateUser = userPrivileges.includes(ROLES.UPDATE_USER);
  const canDeleteUser = userPrivileges.includes(ROLES.DELETE_USER);

  const ResetPasswordConfirmModal = ({ userUuid, onDone }) => {
    const { closeModal } = useModal();
    const [pending, setPending] = useState(false);

    const extractMsg = (res) => {
      if (typeof res?.data === 'string') return res.data;
      if (res?.data?.message) return String(res.data.message);
      if (res?.data && typeof res.data === 'object' && res.data?.message) return String(res.data.message);
      return '';
    };

    const onConfirm = async () => {
      if (!userUuid || pending) return;
      setPending(true);
      try {
        const res = await adminResetPassword(userUuid);
        if (res?.success) {
          const msg = extractMsg(res) || 'Password reset completed';
          const lower = msg.toLowerCase();
          if (lower.includes('enqueue failed') || lower.includes('email enqueue failed')) {
            toast.error(msg);
          } else if (lower.includes('queued')) {
            toast.warning(msg);
          } else {
            toast.success(msg);
          }
          closeModal();
          onDone?.();
        }
      } catch (err) {
        console.error('Failed to reset password:', err);
      } finally {
        setPending(false);
      }
    };

    return (
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden rounded-xl">
        <CardHeader floated={false} shadow={false} className="m-0 rounded-none bg-gradient-to-r from-amber-600 to-orange-600 p-4">
          <Typography variant="h6" className="text-white font-semibold">
            Reset password
          </Typography>
        </CardHeader>
        <CardBody className="p-5 space-y-4">
          <Typography className="text-sm text-gray-700">
            This will invalidate the old password and generate a new one. The user will receive it by email.
          </Typography>
          <div className="flex justify-end gap-2">
            <Button
              variant="outlined"
              color="blue-gray"
              onClick={closeModal}
              disabled={pending}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={pending}
              className="rounded-lg bg-gradient-to-r from-amber-600 to-orange-600"
            >
              {pending ? 'Resetting...' : 'Confirm reset'}
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  };

  const headers = {
    head: [ 'First Name', 'Email', 'Role', 'Status', 'Actions'],
    row: ['firstName', 'email', 'roleName', 'status']
  };

  const handleAddUser = () => {
    openModal(
      <UserForm
        onSuccess={(result) => {
          if (result?.emailQueued) {
            setQueuedEmailBanner('User created successfully, but email delivery is delayed. Admin can resend later.');
          } else {
            setQueuedEmailBanner('');
          }
          setRefreshKey((prev) => prev + 1);
        }}
      />
    );
  };

  const handleEditUser = (user) => {
    openModal(
      <UserForm
        user={user}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    );
  };

  const handleDeleteUser = async (userUuid) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await removeUserById(userUuid);
        toast.success('User deleted successfully');
        setRefreshKey((prev) => prev + 1);
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const handleResendWelcomeEmail = async (userUuid) => {
    if (!userUuid) return;
    try {
      const res = await resendWelcomePasswordEmail(userUuid);
      if (!res?.success) return;
      const msg = typeof res?.data === 'string' ? res.data : (res?.data?.message ? String(res.data.message) : '');
      if (res.status === 400) {
        toast.warning(msg || 'Email not sent. It is still queued or missing.');
      } else {
        toast.success(msg || 'Email sent successfully');
      }
    } catch (err) {
      console.error('Failed to resend welcome email:', err);
    }
  };

  const handleAdminResetPassword = (userUuid) => {
    if (!userUuid) return;
    openModal(
      <ResetPasswordConfirmModal
        userUuid={userUuid}
        onDone={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    );
  };

  const renderRow = (row, index, page, perPage) => (
    <tr key={row.userUuid || index} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-600 border-r border-gray-100">
        {(page - 1) * perPage + index + 1}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.firstName || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.email || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.roleName || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          {row.status || 'Active'}
        </span>
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
        <div className="flex gap-2 flex-wrap">
          {canUpdateUser && (
            <button
              onClick={() => handleEditUser(row)}
              className="relative px-3 py-1.5 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_6px_0_rgba(30,64,175,0.55)] hover:brightness-110 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(30,64,175,0.55)] transition-all"
            >
              Edit
            </button>
          )}
          {canUpdateUser && (
            <button
              onClick={() => handleResendWelcomeEmail(row.userUuid)}
              className="relative px-3 py-1.5 text-xs font-semibold text-black rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 shadow-[0_6px_0_rgba(4,120,87,0.55)] hover:brightness-110 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(4,120,87,0.55)] transition-all"
            >
              Resend Email
            </button>
          )}
          {canUpdateUser && (
            <button
              onClick={() => handleAdminResetPassword(row.userUuid)}
              className="relative px-3 py-1.5 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 shadow-[0_6px_0_rgba(180,83,9,0.55)] hover:brightness-110 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(180,83,9,0.55)] transition-all"
            >
              Reset Password
            </button>
          )}
          {canDeleteUser && (
            <button
              onClick={() => handleDeleteUser(row.userUuid)}
              className="relative px-3 py-1.5 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-red-300 to-red-600 shadow-[0_6px_0_rgba(185,28,28,0.55)] hover:brightness-110 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(185,28,28,0.55)] transition-all"
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  const SkeletonRowComponent = () => (
    <TableSkeletonRow columns={4} withActions withIndex actionCount={2} />
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
          <button
            onClick={handleAddUser}
            disabled={!canCreateUser || institutionMissing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add User
          </button>
        </div>

        {institutionMissing && (
          <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            Admin is not assigned to institution, contact super admin
          </div>
        )}

        {queuedEmailBanner && (
          <div className="p-4 mb-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            {queuedEmailBanner}
          </div>
        )}

        <UsersDataProvider search={searchTerm} key={refreshKey}>
          {({ users, pending, error, page, perPage, totalElements, totalPages, onPageChange, onPerPageChange, onNext, onPrevious, refresh }) => (
            <>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {error && (
                <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              <Table
                headers={headers}
                rows={users}
                loading={pending}
                renderRow={renderRow}
                page={page}
                perPage={perPage}
                placeholder="No users found"
                SkeletonRow={SkeletonRowComponent}
                lastCol
              />

              {!pending && users.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    perPage={perPage}
                    rowsCount={users.length}
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
        </UsersDataProvider>
      </div>
    </div>
  );
};

export default Users;
