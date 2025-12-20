import React, { useEffect, useState } from 'react';
import Input from '@/components/Input';

const PrivilegeForm = ({ 
  privilege = {}, 
  formData = {},
  onFormChange 
}) => {
  const [form, setForm] = useState({
    privilegeName: privilege?.privilegeName || '',
    privilegeDescription: privilege?.privilegeDescription || '',
    privilegeCategory: privilege?.privilegeCategory || '',
  });

  useEffect(() => {
    if (privilege?.privilegeUuid) {
      setForm({
        privilegeName: privilege?.privilegeName || '',
        privilegeDescription: privilege?.privilegeDescription || '',
        privilegeCategory: privilege?.privilegeCategory || '',
      });
    }
  }, [privilege?.privilegeUuid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...form,
      [name]: value,
    };
    setForm(updated);
    if (onFormChange) {
      onFormChange(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <Input
            name="privilegeName"
            label="Privilege Name"
            value={form.privilegeName}
            onChange={handleInputChange}
            placeholder="e.g., create_user, delete_post"
            required
          />
        </div>

        <div className="sm:col-span-2 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <Input
            name="privilegeDescription"
            label="Privilege Description"
            value={form.privilegeDescription}
            onChange={handleInputChange}
            placeholder="Describe what this privilege allows"
            required
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <Input
            name="privilegeCategory"
            label="Privilege Category"
            value={form.privilegeCategory}
            onChange={handleInputChange}
            placeholder="e.g., user, post, role"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PrivilegeForm;
