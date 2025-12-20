import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPrivilege } from '@/pages/admin/api/AdminApi';
import { useApiRequest } from '@/composables/useApiRequest';
import { toasted } from '@/utils/toast';
import PrivilegeForm from '../component/PrivilegeForm';
import Button from '@/components/Button';

const CreatePrivilege = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    privilegeName: '',
    privilegeDescription: '',
    privilegeCategory: '',
  });
  const createReq = useApiRequest();

  const handleFormChange = (data) => {
    setFormData(data);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createReq.send(
      () => createPrivilege(formData),
      (res) => {
        if (res.success) {
          toasted(true, 'Successfully Created', 'Privilege has been created');
          setTimeout(() => {
            navigate('/admin/privileges');
          }, 1500);
        } else {
          toasted(false, 'Error', res.error || 'Failed to create privilege');
        }
      }
    );
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-700 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg
            width="7"
            height="13"
            viewBox="0 0 7 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <path
              opacity="0.6"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.82539 1.0134C6.03505 1.20471 6.05933 1.54072 5.87962 1.76391L2.15854 6.38525L5.87962 11.0066C6.05933 11.2298 6.03505 11.5658 5.82539 11.7571C5.61572 11.9484 5.30007 11.9226 5.12036 11.6994L1.12037 6.73164C0.959876 6.53232 0.959876 6.23819 1.12037 6.03887L5.12036 1.07113C5.30008 0.847943 5.61572 0.822096 5.82539 1.0134Z"
              fill="currentColor"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-medium">Go Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 sm:px-8 py-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Create New Privilege</h1>
            <p className="text-indigo-100 mt-2">Add a new privilege to the system</p>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleCreate}>
              <PrivilegeForm
                privilege={{}}
                formData={formData}
                onFormChange={handleFormChange}
              />

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={handleGoBack}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  loading={createReq.pending}
                >
                  {createReq.pending ? 'Creating...' : 'Create Privilege'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePrivilege;
