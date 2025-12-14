import React, { useState, useEffect } from 'react';
import { 
  Input, 
  Select, 
  Option, 
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
  Alert 
} from '@material-tailwind/react';
import { useModal } from '@/context/ModalContext';
import { createUser, updateUserById, getAllRole } from '../api/UsersApi';
import { getAllInstitution } from '../../institutions/api/InstitutionsApi';
import pako from 'pako';
import { 
  EnvelopeIcon, 
  KeyIcon, 
  UserIcon, 
  UserCircleIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

const UserForm = ({ user = null, onSuccess }) => {
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    title: '',
    firstName: '',
    fatherName: '',
    grandFatherName: '',
    gender: '',
    mobilePhone: '',
    roleUuid: '',
    institutionId: '',
  });

  const isEditMode = !!user;

  // Helper function to decompress logo
  const decompressLogo = (compressedBase64) => {
    try {
      const binaryString = atob(compressedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decompressed = pako.inflate(bytes);
      const binaryDecompressed = String.fromCharCode.apply(null, decompressed);
      const decompressedBase64 = btoa(binaryDecompressed);
      return `data:image/png;base64,${decompressedBase64}`;
    } catch (error) {
      console.error('Error decompressing logo:', error);
      return null;
    }
  };

  // Fetch roles and institutions on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await getAllRole();
        
        let rolesList = [];
        
        // Extract roles from API response
        if (response && response.data && response.data.content && Array.isArray(response.data.content)) {
          rolesList = response.data.content;
        } else if (response && response.content && Array.isArray(response.content)) {
          rolesList = response.content;
        } else if (response && response.data && Array.isArray(response.data)) {
          rolesList = response.data;
        } else if (Array.isArray(response)) {
          rolesList = response;
        }
        
        // Process roles with correct field names
        const validRoles = rolesList
          .filter(role => role && (role.roleUuid || role.id || role.uuid))
          .map(role => ({
            roleUuid: role.roleUuid || role.id || role.uuid || '',
            name: role.roleName || role.name || role.title || 'Unnamed Role',
            description: role.roleDescription || role.description || '',
            privileges: role.privileges || [],
          }));
        
        setRoles(validRoles);
        setError('');
        
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        setError(`Failed to load roles: ${err.message}`);
        setRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };

    const fetchInstitutions = async () => {
      try {
        setInstitutionsLoading(true);
        const response = await getAllInstitution();
        
        let institutionsList = [];
        
        // Extract institutions from API response
        if (response && response.data && response.data.response && Array.isArray(response.data.response)) {
          institutionsList = response.data.response;
        } else if (response && response.data && response.data.content && Array.isArray(response.data.content)) {
          institutionsList = response.data.content;
        } else if (response && response.content && Array.isArray(response.content)) {
          institutionsList = response.content;
        } else if (response && response.data && Array.isArray(response.data)) {
          institutionsList = response.data;
        } else if (Array.isArray(response)) {
          institutionsList = response;
        }
        
        // Process institutions with logos
        const validInstitutions = institutionsList
          .filter(inst => inst && (inst.id || inst.institutionId))
          .map(inst => ({
            id: inst.id || inst.institutionId || '',
            name: inst.name || 'Unnamed Institution',
            logo: inst.logo ? decompressLogo(inst.logo) : null,
          }));
        
        setInstitutions(validInstitutions);
        
      } catch (err) {
        console.error('Failed to fetch institutions:', err);
        setInstitutions([]);
      } finally {
        setInstitutionsLoading(false);
      }
    };

    fetchRoles();
    fetchInstitutions();
  }, []);

  // Initialize form with user data in edit mode
  useEffect(() => {
    if (isEditMode && user) {
      setFormData({
        email: user.email || '',
        password: '',
        title: user.title || '',
        firstName: user.firstName || '',
        fatherName: user.fatherName || '',
        grandFatherName: user.grandFatherName || '',
        gender: user.gender || '',
        mobilePhone: user.mobilePhone || '',
        roleUuid: user.roleUuid || user.role?.roleUuid || '',
        institutionId: user.institutionId || user.institution?.id || '',
      });
    }
  }, [user, isEditMode, roles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!isEditMode && !formData.password) {
      setError('Password is required for new users');
      return false;
    }
    if (!formData.firstName) {
      setError('First name is required');
      return false;
    }
    if (!formData.roleUuid) {
      setError('Role is required');
      return false;
    }
    const selectedRole = roles.find((r) => r.roleUuid === formData.roleUuid);
    if (selectedRole?.name === 'company_admin' || selectedRole?.name === 'company_user') {
      if (!formData.institutionId) {
        setError('Institution is required for this role');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };

      if (isEditMode && !payload.password) {
        delete payload.password;
      }

      if (isEditMode) {
        await updateUserById(user.userUuid, payload);
      } else {
        await createUser(payload);
      }

      closeModal();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err?.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find((r) => r.roleUuid === formData.roleUuid);
  const requiresInstitution = selectedRole?.name === 'company_admin' || selectedRole?.name === 'company_user';

  // Render role options
  const renderRoleOptions = () => {
    if (rolesLoading) {
      return (
        <Option value="" disabled className="text-gray-400">
          <div className="flex items-center gap-2 py-1">
            <svg className="animate-spin h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading roles...
          </div>
        </Option>
      );
    }

    if (roles.length === 0) {
      return (
        <Option value="" disabled className="text-red-400 text-sm">
          No roles available
        </Option>
      );
    }

    return (
      <>
        <Option value="" className="text-gray-400 text-sm">
          Select a role
        </Option>
        {roles.map((role) => (
          <Option 
            key={role.roleUuid}
            value={role.roleUuid}
            className="text-gray-700 hover:bg-blue-50 text-sm"
          >
            <div className="py-1">
              <div className="font-medium">{role.name}</div>
              {role.description && (
                <div className="text-xs text-gray-500 mt-0.5">{role.description}</div>
              )}
            </div>
          </Option>
        ))}
      </>
    );
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader 
            shadow={false} 
            className="rounded-t-xl bg-gradient-to-r from-blue-500 to-blue-600 py-4 px-6"
          >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCircleIcon className="h-6 w-6 text-white" />
            <Typography variant="h5" className="text-white font-semibold">
              {isEditMode ? 'Edit User' : 'New User'}
            </Typography>
          </div>
          <Button
            variant="text"
            className="text-white hover:bg-white/10 p-1 h-8 w-8 min-w-0"
            onClick={closeModal}
          >
            ✕
          </Button>
        </div>
      </CardHeader>

      <CardBody className="p-6">
        {error && (
          <Alert 
            color="red" 
            variant="filled" 
            className="mb-4 py-2 text-sm"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Authentication Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <KeyIcon className="h-5 w-5 text-blue-500" />
              <Typography variant="h6" color="blue-gray" className="font-semibold">
                Authentication
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Email *
                </Typography>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isEditMode || loading}
                  className="!border-gray-300 focus:!border-blue-500 !text-sm"
                  labelProps={{ className: "hidden" }}
                  placeholder="user@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  {isEditMode ? 'New Password' : 'Password *'}
                </Typography>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="!border-gray-300 focus:!border-blue-500 !text-sm"
                  labelProps={{ className: "hidden" }}
                  placeholder={isEditMode ? 'Leave empty to keep current' : 'Enter password'}
                  required={!isEditMode}
                />
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <IdentificationIcon className="h-5 w-5 text-blue-500" />
              <Typography variant="h6" color="blue-gray" className="font-semibold">
                Personal Information
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Title
                </Typography>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="!border-gray-300 focus:!border-blue-500 !text-sm"
                  labelProps={{ className: "hidden" }}
                  placeholder="e.g., Mr., Ms."
                />
              </div>

              {/* First Name */}
              <div className="space-y-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  First Name *
                </Typography>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="!border-gray-300 focus:!border-blue-500 !text-sm"
                  labelProps={{ className: "hidden" }}
                  placeholder="Enter first name"
                  required
                />
              </div>

              {/* Father Name */}
              <div className="space-y-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Father Name
                </Typography>
                <Input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="!border-gray-300 focus:!border-blue-500 !text-sm"
                  labelProps={{ className: "hidden" }}
                  placeholder="Father's name"
                />
              </div>

              {/* Grand Father Name */}
              <div className="space-y-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Grand Father Name
                </Typography>
                <Input
                  type="text"
                  name="grandFatherName"
                  value={formData.grandFatherName}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="!border-gray-300 focus:!border-blue-500 !text-sm"
                  labelProps={{ className: "hidden" }}
                  placeholder="Grandfather's name"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Gender
                </Typography>
                <Select
                  value={formData.gender}
                  onChange={(value) => handleSelectChange('gender', value)}
                  disabled={loading}
                  className="!border-gray-300 focus:!border-blue-500 !text-sm"
                  labelProps={{ className: "hidden" }}
                  menuProps={{ className: "max-h-48" }}
                >
                  <Option value="" className="text-gray-400 text-sm">
                    Select Gender
                  </Option>
                  <Option value="male" className="text-gray-700 text-sm">
                    Male
                  </Option>
                  <Option value="female" className="text-gray-700 text-sm">
                    Female
                  </Option>
                  <Option value="other" className="text-gray-700 text-sm">
                    Other
                  </Option>
                </Select>
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Mobile Phone
                </Typography>
                <Input
                  type="tel"
                  name="mobilePhone"
                  value={formData.mobilePhone}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="!border-gray-300 focus:!border-blue-500 !text-sm"
                  labelProps={{ className: "hidden" }}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Role & Permissions Section - MOVED TO END */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
              <Typography variant="h6" color="blue-gray" className="font-semibold">
                Role & Permissions
              </Typography>
            </div>
            
            <div className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    User Role *
                  </Typography>
                  {!rolesLoading && (
                    <Typography variant="small" color="gray" className="text-xs">
                      {roles.length} available
                    </Typography>
                  )}
                </div>
                <Select
                  value={formData.roleUuid}
                  onChange={(value) => handleSelectChange('roleUuid', value)}
                  disabled={rolesLoading || loading}
                  className="!border-gray-300 focus:!border-blue-500 !text-sm"
                  label={selectedRole ? selectedRole.name : 'Select a role'}
                  menuProps={{ className: "max-h-48 z-[9999]" }}
                >
                  {renderRoleOptions()}
                </Select>
                {formData.roleUuid && selectedRole && (
                  <div className="mt-2 text-sm text-gray-700">
                    <strong>Selected:</strong> {selectedRole.name}
                  </div>
                )}
              </div>

              {/* Institution Selection (conditional) */}
              {requiresInstitution && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="h-4 w-4 text-blue-500" />
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      Institution *
                    </Typography>
                  </div>
                  {(() => {
                    const selectedInstitution = institutions.find(i => i.id === formData.institutionId);
                    return (
                      <Select
                        value={formData.institutionId}
                        onChange={(value) => handleSelectChange('institutionId', value)}
                        disabled={institutionsLoading || loading}
                        className="!border-gray-300 focus:!border-blue-500 !text-sm"
                        label={selectedInstitution ? selectedInstitution.name : (institutionsLoading ? 'Loading...' : 'Select institution')}
                        menuProps={{ className: "max-h-48 z-[9999]" }}
                      >
                        <Option value="" className="text-gray-400 text-sm">
                          {institutionsLoading ? 'Loading institutions...' : 'Select institution'}
                        </Option>
                        {institutions.map((inst) => (
                          <Option 
                            key={inst.id}
                            value={inst.id}
                            className="text-gray-700 text-sm"
                          >
                            <div className="flex items-center gap-2 py-1">
                              {inst.logo && (
                                <img
                                  src={inst.logo}
                                  alt={inst.name}
                                  className="h-5 w-5 object-contain rounded"
                                />
                              )}
                              <span>{inst.name}</span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    );
                  })()}
                  {formData.institutionId && institutions.find(i => i.id === formData.institutionId) && (
                    <div className="mt-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <strong>Selected:</strong>
                        {institutions.find(i => i.id === formData.institutionId)?.logo && (
                          <img
                            src={institutions.find(i => i.id === formData.institutionId).logo}
                            alt="institution"
                            className="h-4 w-4 object-contain rounded"
                          />
                        )}
                        <span>{institutions.find(i => i.id === formData.institutionId)?.name}</span>
                      </div>
                    </div>
                  )}
                  <Typography variant="small" color="gray" className="mt-1 text-xs">
                    Required for company roles
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="text"
              color="blue-gray"
              onClick={closeModal}
              disabled={loading}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserIcon className="h-3 w-3" />
                  {isEditMode ? 'Update' : 'Create'}
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default UserForm;