 import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
  Alert,
} from '@material-tailwind/react';
import { useModal } from '@/context/ModalContext';
import { createInstitution, updateInstitutionById } from '../api/InstitutionsApi';
import {
  BuildingOfficeIcon,
  LinkIcon,
  DocumentTextIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import pako from 'pako';

const InstitutionForm = ({ institution = null, onSuccess }) => {
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logoFile: null,
    description: '',
    website: '',
  });

  const isEditMode = !!institution;

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

  useEffect(() => {
    if (isEditMode && institution) {
      setFormData({
        name: institution.name || '',
        logoFile: null,
        description: institution.description || '',
        website: institution.website || '',
      });
      if (institution.logo) {
        // Decompress the logo if it's compressed
        const logoDataUrl = institution.logo.startsWith('data:')
          ? institution.logo
          : decompressLogo(institution.logo);
        if (logoDataUrl) {
          setLogoPreview(logoDataUrl);
        }
      }
    }
  }, [institution, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleLogoFile(file);
    }
  };

  const handleLogoFile = (file) => {
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Logo must be PNG, JPEG, JPG, GIF, SVG, or WEBP format');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Logo file size must be less than 5MB');
      return;
    }

    // Store the File object directly for FormData upload
    setFormData((prev) => ({
      ...prev,
      logoFile: file,
    }));

    // Create preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setError('');
    setSuccess('Logo uploaded successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoFile(file);
    }
  };

  const removeLogo = () => {
    // Revoke the object URL to free up memory
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setFormData((prev) => ({
      ...prev,
      logoFile: null,
    }));
    setLogoPreview('');
    setSuccess('Logo removed');
    setTimeout(() => setSuccess(''), 3000);
  };

  const validateForm = () => {
    if (!formData.name || formData.name.trim().length === 0) {
      setError('Institution name is required');
      return false;
    }

    if (formData.name.length > 255) {
      setError('Institution name must be less than 255 characters');
      return false;
    }

    if (formData.description && formData.description.length > 1000) {
      setError('Description must be less than 1000 characters');
      return false;
    }

    if (formData.website && formData.website.trim() !== '') {
      const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      if (!urlPattern.test(formData.website)) {
        setError('Please enter a valid website URL (e.g., https://example.com)');
        return false;
      }

      if (formData.website.length > 255) {
        setError('Website URL must be less than 255 characters');
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
    setError('');
    setSuccess('');

    try {
      const res = isEditMode
        ? await updateInstitutionById(institution.institutionId || institution.id, formData)
        : await createInstitution(formData);

      if (!res?.success) {
        setError(res?.error || res?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} institution`);
        return;
      }

      setSuccess(isEditMode ? 'Institution updated successfully!' : 'Institution created successfully!');

      setTimeout(() => {
        closeModal();
        if (onSuccess) {
          onSuccess();
        }
      }, 800);
    } catch (err) {
      console.error('Error saving institution:', err);
      setError(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} institution`);
    } finally {
      setLoading(false);
    }
  };

  const CharacterCounter = ({ current, max }) => (
    <div className="text-right">
      <span className={`text-xs ${current > max * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
        {current}/{max}
      </span>
    </div>
  );

  return (
    <Card className="w-full max-w-5xl shadow-2xl border-0 overflow-hidden rounded-xl">
      {/* Compact Header */}
      <CardHeader
        floated={false}
        shadow={false}
        className="m-0 rounded-none bg-gradient-to-r from-blue-600 to-indigo-600 py-4 px-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <BuildingOfficeIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <Typography variant="h5" className="text-white font-bold">
                {isEditMode ? 'Edit Institution' : 'Create Institution'}
              </Typography>
            </div>
          </div>
          <Button
            variant="text"
            className="text-white hover:bg-white/10 p-2 h-8 w-8 min-w-0 rounded-lg"
            onClick={closeModal}
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardBody className="p-6 bg-gradient-to-br from-gray-50 to-white">
            {/* Status Messages */}
            {(error || success) && (
              <div className="mb-4">
                {error && (
                  <Alert
                    color="red"
                    icon={<ExclamationCircleIcon className="h-4 w-4" />}
                    className="rounded-lg py-2 text-sm"
                  >
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert
                    color="green"
                    icon={<CheckCircleIcon className="h-4 w-4" />}
                    className="rounded-lg py-2 text-sm"
                  >
                    {success}
                  </Alert>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Main Grid - Wider Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column - Logo Upload */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="space-y-2">
                    <Typography variant="small" className="font-semibold text-gray-700">
                      Institution Logo
                    </Typography>
                    <Typography variant="small" className="text-gray-500 text-xs">
                      Optional • Max 5MB
                    </Typography>
                    
                    <div
                      className={`relative border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} rounded-xl p-4 transition-all duration-200 hover:border-blue-400 hover:bg-gray-50 h-full min-h-[200px]`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                        onChange={handleLogoChange}
                        disabled={loading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="logo-upload"
                      />
                      
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        {logoPreview ? (
                          <div className="space-y-2">
                            <div className="relative inline-block">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="h-24 w-24 object-contain rounded-lg border-2 border-gray-200 shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={removeLogo}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </div>
                            <Typography variant="small" className="text-gray-500">
                              Click to change logo
                            </Typography>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                              <CloudArrowUpIcon className="h-8 w-8 text-blue-500 mx-auto" />
                            </div>
                            <Typography variant="small" className="font-medium text-gray-700">
                              Upload Logo
                            </Typography>
                            <Typography variant="small" className="text-gray-500 text-xs">
                              Drag & drop or click to browse
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Required Fields Note */}
                  <div className="text-right">
                    <Typography variant="small" className="text-gray-500 text-xs">
                      <span className="text-red-500">*</span> Required fields
                    </Typography>
                  </div>

                  {/* Institution Name */}
                  <div className="space-y-1">
                    <Typography variant="small" className="font-semibold text-gray-700">
                      <span className="text-red-500">*</span> Institution Name
                    </Typography>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                      maxLength="255"
                      className="!border-gray-300 focus:!border-blue-500 !text-sm py-2.5 px-4 rounded-lg"
                      labelProps={{ className: 'hidden' }}
                      placeholder="Enter institution name"
                      required
                      icon={<BuildingOfficeIcon className="h-4 w-4 text-gray-400" />}
                    />
                    <CharacterCounter current={formData.name.length} max={255} />
                  </div>

                  {/* Website URL */}
                  <div className="space-y-1">
                    <Typography variant="small" className="font-semibold text-gray-700">
                      Website (Optional)
                    </Typography>
                    <Input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={loading}
                      maxLength="255"
                      className="!border-gray-300 focus:!border-blue-500 !text-sm py-2.5 px-4 rounded-lg"
                      labelProps={{ className: 'hidden' }}
                      placeholder="https://example.com"
                      icon={<LinkIcon className="h-4 w-4 text-gray-400" />}
                    />
                    {formData.website && (
                      <CharacterCounter current={formData.website.length} max={255} />
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <Typography variant="small" className="font-semibold text-gray-700">
                      Description (Optional)
                    </Typography>
                    <div className="relative">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        disabled={loading}
                        maxLength="1000"
                        placeholder="Brief description of the institution..."
                        className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                        rows="3"
                      />
                      <DocumentTextIcon className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    </div>
                    <CharacterCounter current={formData.description.length} max={1000} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outlined"
                  color="blue-gray"
                  onClick={closeModal}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-medium rounded-lg border hover:shadow-sm transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow hover:shadow-md transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-3.5 w-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isEditMode ? (
                        <>
                          <CheckCircleIcon className="h-3.5 w-3.5" />
                          Update
                        </>
                      ) : (
                        <>
                          <BuildingOfficeIcon className="h-3.5 w-3.5" />
                          Create
                        </>
                      )}
                    </span>
                  )}
                </Button>
              </div>
            </form>
      </CardBody>
    </Card>
  );
};

export default InstitutionForm;