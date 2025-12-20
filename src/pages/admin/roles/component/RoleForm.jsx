import React, { useEffect, useState } from 'react';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import SelectPrivilegeInput from './SelectPrivilegeInput';

const RoleForm = ({ 
  role = {}, 
  privileges = [], 
  selectedPrivileges = [],
  onFormChange 
}) => {
  const [formData, setFormData] = useState({
    roleName: role?.roleName || '',
    roleDescription: role?.roleDescription || '',
    privileges: selectedPrivileges || [],
  });

  useEffect(() => {
    if (role?.roleUuid) {
      setFormData({
        roleName: role?.roleName || '',
        roleDescription: role?.roleDescription || '',
        privileges: selectedPrivileges || [],
      });
    }
  }, [role?.roleUuid, selectedPrivileges]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...formData,
      [name]: value,
    };
    setFormData(updated);
    if (onFormChange) {
      onFormChange(updated);
    }
  };

  const handlePrivilegesChange = (selectedPrivs) => {
    const updated = {
      ...formData,
      privileges: selectedPrivs,
    };
    setFormData(updated);
    if (onFormChange) {
      onFormChange(updated);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <Input
            name="roleName"
            label="Role Name"
            value={formData.roleName}
            onChange={handleInputChange}
            placeholder="e.g., Administrator, Editor"
            required
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <Textarea
            name="roleDescription"
            label="Role Description"
            value={formData.roleDescription}
            onChange={handleInputChange}
            placeholder="Describe the purpose of this role..."
            rows={4}
            required
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <SelectPrivilegeInput
          label="Assign Privileges"
          name="privileges"
          options={privileges}
          selectedPrivileges={formData.privileges}
          onChange={handlePrivilegesChange}
          required
        />
      </div>
    </div>
  );
};

export default RoleForm;
