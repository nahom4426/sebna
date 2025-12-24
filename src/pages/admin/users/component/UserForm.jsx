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
import { getPricePerShare } from '@/pages/admin/api/SebnaSettingsApi';
import pako from 'pako';
import { toast } from '@/utils/utils';
import { 
  EnvelopeIcon, 
  KeyIcon, 
  UserIcon, 
  UserCircleIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  AtSymbolIcon,
  LockClosedIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  EnvelopeIcon as EnvelopeSolid,
  UserCircleIcon as UserCircleSolid,
  ShieldCheckIcon as ShieldCheckSolid 
} from '@heroicons/react/24/solid';

const UserForm = ({ user = null, onSuccess }) => {
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [pricePerShare, setPricePerShare] = useState(10000);
  const [error, setError] = useState('');
  const [queuedEmailBanner, setQueuedEmailBanner] = useState('');
  const [activeSection, setActiveSection] = useState('personal'); // personal, auth, role
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    fatherName: '',
    grandFatherName: '',
    gender: '',
    mobilePhone: '',
    roleUuid: '',
    sharesBoughtAmount: '',
    amountPaid: '',
  });

  const isEditMode = !!user;

  const normalizeRoleName = (name) => String(name || '').trim().toLowerCase().replace(/\s+/g, '_');

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

  // Fetch roles on mount
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
        
        // Process roles with correct field names (and filter to allowed roles)
        const allowedRoleNames = new Set(['super_admin', 'shareholders']);
        const validRoles = rolesList
          .filter(role => role && (role.roleUuid || role.id || role.uuid))
          .map(role => ({
            roleUuid: role.roleUuid || role.id || role.uuid || '',
            name: role.roleName || role.name || role.title || 'Unnamed Role',
            description: role.roleDescription || role.description || '',
            privileges: role.privileges || [],
          }))
          .filter((role) => allowedRoleNames.has(normalizeRoleName(role?.name)));
        
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
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await getPricePerShare();
        const pps = res?.data?.pricePerShare;
        if (Number.isFinite(Number(pps)) && Number(pps) > 0) {
          setPricePerShare(Number(pps));
        }
      } catch (err) {
        console.error('Failed to fetch price per share:', err);
      }
    };
    fetchPrice();
  }, []);

  // Initialize form with user data in edit mode
  useEffect(() => {
    if (isEditMode && user) {
      setFormData({
        email: user.email || '',
        firstName: user.firstName || '',
        fatherName: user.fatherName || '',
        grandFatherName: user.grandFatherName || '',
        gender: user.gender || '',
        mobilePhone: user.mobilePhone || '',
        roleUuid: user.roleUuid || user.role?.roleUuid || '',
        sharesBoughtAmount: user.sharesBoughtAmount ?? '',
        amountPaid: user.amountPaid ?? '',
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
    setQueuedEmailBanner('');
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setQueuedEmailBanner('');
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
  
    if (!formData.firstName) {
      setError('First name is required');
      return false;
    }

    if (!formData.fatherName || formData.fatherName.trim().length === 0) {
      setError('Father name is required');
      return false;
    }

    if (!formData.gender) {
      setError('Gender is required');
      return false;
    }

    if (!formData.mobilePhone || formData.mobilePhone.trim().length === 0) {
      setError('Mobile phone is required');
      return false;
    }

    if (!formData.roleUuid) {
      setError('Role is required');
      return false;
    }

    const selectedRole = roles.find((r) => r.roleUuid === formData.roleUuid);
    const selectedRoleNormalized = normalizeRoleName(selectedRole?.name);
    if (selectedRoleNormalized === 'shareholders') {
      const sharesQty = Number(formData.sharesBoughtAmount);
      const paid = Number(formData.amountPaid);
      const pps = Number(pricePerShare);

      if (!Number.isFinite(sharesQty) || !Number.isInteger(sharesQty)) {
        setError('Shares quantity must be a whole number');
        return false;
      }
      if (sharesQty < 5) {
        setError('Shares quantity must be at least 5');
        return false;
      }
      if (!Number.isFinite(pps) || pps <= 0) {
        setError('Price per share is invalid');
        return false;
      }
      const totalCost = sharesQty * pps;

      if (!Number.isFinite(paid) || paid < 0) {
        setError('Amount paid cannot be negative');
        return false;
      }
      if (paid > totalCost) {
        setError('Amount paid cannot exceed total cost');
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

      const selectedRole = roles.find((r) => r.roleUuid === payload.roleUuid);
      const selectedRoleNormalized = normalizeRoleName(selectedRole?.name);
      if (selectedRoleNormalized !== 'shareholders') {
        delete payload.sharesBoughtAmount;
        delete payload.amountPaid;
      } else {
        payload.sharesBoughtAmount = Number.parseInt(String(payload.sharesBoughtAmount), 10);
        payload.amountPaid = Number(payload.amountPaid);
      }

      const res = isEditMode
        ? await updateUserById(user.userUuid, payload)
        : await createUser(payload);

      const msg =
        typeof res?.data === 'string'
          ? res.data
          : (res?.data?.message ? String(res.data.message) : (res?.error ? String(res.error) : ''));

      const lowerMsg = (msg || '').toLowerCase();
      const emailQueued = !isEditMode && lowerMsg.includes('unable to send password email right now');
      const createdOk = !isEditMode && (lowerMsg.includes('user registered successfully') || lowerMsg.includes('user created successfully'));
      const treatAsSuccess = Boolean(res?.success) || (createdOk && emailQueued);

      if (!treatAsSuccess) {
        setError(msg || 'Failed to save user');
        return;
      }

      if (emailQueued) {
        setQueuedEmailBanner('User created successfully, but email delivery is delayed. Admin can resend later.');
        toast.warning('User created successfully, but email delivery is delayed. Admin can resend later.');
      }

      if (msg) {
        toast.success(msg);
      } else {
        toast.success(isEditMode ? 'User updated successfully' : 'User created successfully');
      }

      closeModal();
      if (onSuccess) {
        onSuccess({
          emailQueued,
          message: msg,
        });
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find((r) => r.roleUuid === formData.roleUuid);
  const selectedRoleNormalized = normalizeRoleName(selectedRole?.name);
  const isShareholderRole = selectedRoleNormalized === 'shareholders';

  // Render role options
  const renderRoleOptions = () => {
    if (rolesLoading) {
      return (
        <Option value="" disabled className="text-gray-400">
          <div className="flex items-center gap-2 py-2 px-3">
            <ArrowPathIcon className="h-3 w-3 animate-spin text-blue-500" />
            <span className="text-xs">Loading roles...</span>
          </div>
        </Option>
      );
    }

    if (roles.length === 0) {
      return (
        <Option value="" disabled className="text-gray-400 text-xs">
          <div className="flex items-center gap-2 py-2 px-3">
            <ExclamationTriangleIcon className="h-3 w-3 text-amber-500" />
            <span>No roles available</span>
          </div>
        </Option>
      );
    }

    return (
      <>
        <Option value="" className="text-gray-400 text-xs py-2 px-3">
          Select a role
        </Option>
        {roles.map((role) => (
          <Option 
            key={role.roleUuid}
            value={role.roleUuid}
            className="text-gray-700 hover:bg-blue-50 transition-colors text-xs"
          >
            <div className="py-2 px-3">
              <div className="font-medium">{role.name}</div>
              {role.description && (
                <div className="text-xs text-gray-500 mt-0.5 truncate">{role.description}</div>
              )}
            </div>
          </Option>
        ))}
      </>
    );
  };

  // Form navigation tabs
  const formSections = [
    { id: 'personal', label: 'Personal Info', icon: UserCircleIcon },
    { id: 'auth', label: 'Authentication', icon: ShieldCheckIcon },
    { id: 'role', label: 'Role & Access', icon: BriefcaseIcon }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-3xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50">
        {/* Header */}
        <CardHeader 
          shadow={false} 
          className="rounded-t-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 py-4 px-6 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  {isEditMode ? (
                    <UserCircleSolid className="h-6 w-6 text-white" />
                  ) : (
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <Typography variant="h4" className="text-white font-bold">
                    {isEditMode ? 'Edit User Profile' : 'Create New User'}
                  </Typography>
                  <Typography variant="small" className="text-blue-100 font-medium mt-1">
                    {isEditMode ? 'Update user details and permissions' : 'Add a new user to the system'}
                  </Typography>
                </div>
              </div>
              <Button
                variant="text"
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 h-10 w-10 min-w-0 rounded-full transition-all"
                onClick={closeModal}
              >
                <XCircleIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Form Navigation Tabs */}
        <div className="px-6 pt-4 border-b border-gray-200">
          <div className="flex gap-2">
            {formSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeSection === section.id ? 'text-blue-600' : ''}`} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        <CardBody className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Notifications */}
          {queuedEmailBanner && (
            <Alert
              color="amber"
              className="mb-6 border-l-4 border-amber-500 bg-amber-50/80 rounded-lg"
              icon={<InformationCircleIcon className="h-5 w-5" />}
            >
              <Typography variant="small" className="font-medium text-amber-900">
                {queuedEmailBanner}
              </Typography>
            </Alert>
          )}
          {error && (
            <Alert
              color="red"
              className="mb-6 border-l-4 border-red-500 bg-red-50/80 rounded-lg"
              icon={<ExclamationTriangleIcon className="h-5 w-5" />}
            >
              <Typography variant="small" className="font-medium text-red-900">
                {error}
              </Typography>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className={`space-y-4 ${activeSection !== 'personal' ? 'hidden' : ''}`}>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <IdentificationIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <Typography variant="h6" color="blue-gray" className="font-bold">
                      Personal Information
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      Basic details about the user
                    </Typography>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span>First Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="!border-gray-300 focus:!border-blue-500 !text-sm pl-10 bg-white"
                        labelProps={{ className: "hidden" }}
                        placeholder="John"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Father Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span>Father Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="!border-gray-300 focus:!border-blue-500 !text-sm pl-10 bg-white"
                        labelProps={{ className: "hidden" }}
                        placeholder="Doe"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <UserGroupIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Grand Father Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span>Grand Father Name</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="grandFatherName"
                        value={formData.grandFatherName}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="!border-gray-300 focus:!border-blue-500 !text-sm pl-10 bg-white"
                        labelProps={{ className: "hidden" }}
                        placeholder="Smith"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span>Gender</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.gender}
                      onChange={(value) => handleSelectChange('gender', value)}
                      disabled={loading}
                      className="!border-gray-300 focus:!border-blue-500 !text-sm bg-white"
                      labelProps={{ className: "hidden" }}
                    >
                      <Option value="" className="text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          Select Gender
                        </div>
                      </Option>
                      <Option value="male" className="text-gray-700 text-sm">
                        <div className="flex items-center gap-2">
                          <span>👨</span>
                          Male
                        </div>
                      </Option>
                      <Option value="female" className="text-gray-700 text-sm">
                        <div className="flex items-center gap-2">
                          <span>👩</span>
                          Female
                        </div>
                      </Option>
                    </Select>
                  </div>

                  {/* Mobile Phone */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span>Mobile Phone</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="tel"
                        name="mobilePhone"
                        value={formData.mobilePhone}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="!border-gray-300 focus:!border-blue-500 !text-sm pl-10 bg-white"
                        labelProps={{ className: "hidden" }}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication Section */}
            <div className={`space-y-4 ${activeSection !== 'auth' ? 'hidden' : ''}`}>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ShieldCheckIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <Typography variant="h6" color="blue-gray" className="font-bold">
                      Authentication Details
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      Login credentials and security
                    </Typography>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span>Email Address</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="!border-gray-300 focus:!border-blue-500 !text-sm pl-10 bg-white"
                        labelProps={{ className: "hidden" }}
                        placeholder="john.doe@company.com"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Password Info */}
                  {!isEditMode && (
                    <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <InformationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <Typography variant="small" className="font-medium text-blue-900">
                            Password Information
                          </Typography>
                          <Typography variant="small" className="text-blue-700">
                            A secure password will be automatically generated and sent to the user's email.
                          </Typography>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Role & Access Section */}
            <div className={`space-y-4 ${activeSection !== 'role' ? 'hidden' : ''}`}>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <BriefcaseIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Role & Permissions
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        Set user permissions and access levels
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <span>User Role</span>
                          <span className="text-red-500">*</span>
                        </label>
                        {!rolesLoading && (
                          <Typography variant="small" color="gray" className="text-xs">
                            {roles.length} roles available
                          </Typography>
                        )}
                      </div>
                      <div className="relative">
                        <Select
                          value={formData.roleUuid}
                          onChange={(value) => handleSelectChange('roleUuid', value)}
                          disabled={rolesLoading || loading}
                          className="!border-gray-300 focus:!border-blue-500 !text-sm bg-white"
                          menuProps={{ className: "max-h-64" }}
                        >
                          {renderRoleOptions()}
                        </Select>
                        {formData.roleUuid && selectedRole && (
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                      </div>
                      {selectedRole && (
                        <div className="bg-white/50 border border-gray-200 rounded-lg p-3 mt-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="h-4 w-4 text-blue-500" />
                            <Typography variant="small" className="font-medium text-gray-900">
                              Selected Role: {selectedRole.name}
                            </Typography>
                          </div>
                          {selectedRole.description && (
                            <Typography variant="small" className="text-gray-600 mt-1">
                              {selectedRole.description}
                            </Typography>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Shareholder payment fields */}
                    {isShareholderRole && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <span>Shares Quantity</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            name="sharesBoughtAmount"
                            value={formData.sharesBoughtAmount}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="!border-gray-300 focus:!border-blue-500 !text-sm bg-white"
                            labelProps={{ className: "hidden" }}
                            placeholder="5"
                            min={5}
                            step="1"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <span>Amount Paid</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            name="amountPaid"
                            value={formData.amountPaid}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="!border-gray-300 focus:!border-blue-500 !text-sm bg-white"
                            labelProps={{ className: "hidden" }}
                            placeholder="15000"
                            min={0}
                            step="0.01"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <span>Amount Remaining</span>
                          </label>
                          <Input
                            type="text"
                            value={(() => {
                              const sharesQty = Number(formData.sharesBoughtAmount);
                              const paid = Number(formData.amountPaid);
                              const pps = Number(pricePerShare);
                              if (!Number.isFinite(sharesQty) || !Number.isFinite(paid) || !Number.isFinite(pps)) return '';
                              const totalCost = sharesQty * pps;
                              return String(Math.max(0, totalCost - paid));
                            })()}
                            disabled
                            className="!border-gray-200 !text-sm bg-gray-50"
                            labelProps={{ className: "hidden" }}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            {/* Form Progress & Actions */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                {/* Form Progress Indicator */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {formSections.map((section, index) => (
                      <React.Fragment key={section.id}>
                        <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
                          activeSection === section.id 
                            ? 'bg-blue-600' 
                            : formSections.findIndex(s => s.id === activeSection) > index
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`} />
                        {index < formSections.length - 1 && (
                          <div className="h-0.5 w-4 bg-gray-300" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <Typography variant="small" className="text-gray-600 ml-2">
                    Step {formSections.findIndex(s => s.id === activeSection) + 1} of {formSections.length}
                  </Typography>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="text"
                    color="gray"
                    onClick={(e) => {
                      e.preventDefault();
                      closeModal();
                    }}
                    disabled={loading}
                    className="px-4 py-2.5 text-sm font-medium hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </Button>
                  
                  {activeSection !== formSections[formSections.length - 1].id ? (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const currentIndex = formSections.findIndex(s => s.id === activeSection);
                        if (currentIndex < formSections.length - 1) {
                          setActiveSection(formSections[currentIndex + 1].id);
                        }
                      }}
                      className="px-4 py-2.5 text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-all shadow-sm"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading || (!formData.roleUuid || rolesLoading)}
                      className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <ArrowPathIcon className="h-3 w-3 animate-spin text-white" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {isEditMode ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4" />
                              Update User
                            </>
                          ) : (
                            <>
                              <UserIcon className="h-4 w-4" />
                              Create User
                            </>
                          )}
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserForm;