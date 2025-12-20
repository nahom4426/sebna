import React, { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Input, Typography } from '@material-tailwind/react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/utils/utils';
import { changePassword, updateProfileData, uploadProfilePicture } from '@/pages/admin/users/api/ProfileApi';

export function Profile() {
  const auth = useAuthStore((state) => state.auth);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [searchParams, setSearchParams] = useSearchParams();

  const user = auth?.user;
  const userUuid = user?.userUuid || user?.uuid || user?.id;

  const initialTab = (searchParams.get('tab') || 'profile').toLowerCase();
  const [activeTab, setActiveTab] = useState(initialTab === 'security' ? 'security' : 'profile');

  const [profilePending, setProfilePending] = useState(false);
  const [securityPending, setSecurityPending] = useState(false);
  const [photoPending, setPhotoPending] = useState(false);

  const [profileValues, setProfileValues] = useState({
    title: user?.title || '',
    firstName: user?.firstName || '',
    fatherName: user?.fatherName || '',
    grandFatherName: user?.grandFatherName || '',
    gender: user?.gender || '',
    mobilePhone: user?.mobilePhone || '',
    email: user?.email || '',
  });

  const [securityValues, setSecurityValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fileInputRef = useRef(null);

  const imageSrc = useMemo(() => {
    const img = user?.imageData;
    if (!img) return '';
    if (img.startsWith('data:image/')) return img;
    return `data:image/png;base64,${img}`;
  }, [user?.imageData]);

  const switchTab = (tab) => {
    const next = tab === 'security' ? 'security' : 'profile';
    setActiveTab(next);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('tab', next);
      return p;
    });
  };

  const updateAuthUser = (patch) => {
    if (!auth?.accessToken || !auth?.user) return;
    const nextUser = { ...auth.user, ...patch };
    const nextAuth = { ...auth, user: nextUser };
    setAuth(nextAuth);
    localStorage.setItem('userDetail', JSON.stringify(nextUser));
  };

  const onSaveProfile = async () => {
    if (!userUuid || profilePending) return;
    setProfilePending(true);
    try {
      const res = await updateProfileData(userUuid, profileValues);
      if (res?.success) {
        updateAuthUser(profileValues);
        const msg = typeof res?.data === 'string' ? res.data : (res?.data?.message ? String(res.data.message) : 'Profile updated successfully');
        toast.success(msg);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setProfilePending(false);
    }
  };

  const onTriggerPhoto = () => {
    if (photoPending) return;
    fileInputRef.current?.click();
  };

  const onPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || photoPending || !userUuid) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const preview = String(event.target?.result || '');
      setPhotoPending(true);
      try {
        const formData = new FormData();
        formData.append('profilePicture', file);

        const userName = user?.email || user?.userName || user?.mobilePhone || '';
        const res = await uploadProfilePicture(userUuid, userName, formData);
        if (res?.success) {
          updateAuthUser({ imageData: preview });
          toast.success('Profile picture updated successfully');
        }
      } catch (err) {
        console.error('Failed to upload profile picture:', err);
      } finally {
        setPhotoPending(false);
        e.target.value = '';
      }
    };
    reader.onerror = () => {
      toast.error('Error reading image file');
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const onChangePassword = async () => {
    if (!userUuid || securityPending) return;
    if (!securityValues.oldPassword || !securityValues.newPassword || !securityValues.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (securityValues.newPassword !== securityValues.confirmPassword) {
      toast.error('Confirm password does not match');
      return;
    }
    setSecurityPending(true);
    try {
      const res = await changePassword(userUuid, securityValues);
      if (res?.success) {
        const msg = typeof res?.data === 'string' ? res.data : (res?.data?.message ? String(res.data.message) : 'Password changed successfully');
        toast.success(msg);
        setSecurityValues({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      console.error('Failed to change password:', err);
    } finally {
      setSecurityPending(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div className="relative px-4 sm:px-8 py-10 sm:py-12">
          <Typography variant="h4" className="text-white font-bold">
            My Profile
          </Typography>
          <Typography className="text-white/80 mt-1 text-sm">
            Update your profile details, photo and security settings.
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-4 sm:mt-6">
        <div className="lg:col-span-4">
          <Card className="shadow-xl border border-blue-gray-100 overflow-hidden">
            <CardHeader floated={false} shadow={false} className="m-0 rounded-none bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <Typography variant="h6" className="text-blue-gray-800">
                Profile photo
              </Typography>
              <Typography className="text-xs text-blue-gray-500 mt-1">
                JPG/PNG, max size depends on backend.
              </Typography>
            </CardHeader>
            <CardBody className="p-4 space-y-4">
              <div className="w-full rounded-xl border border-blue-gray-100 bg-white p-3">
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-blue-gray-50 flex items-center justify-center">
                  {imageSrc ? (
                    <img src={imageSrc} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm text-blue-gray-400">No photo</div>
                  )}
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPhotoChange}
              />

              <Button
                onClick={onTriggerPhoto}
                disabled={photoPending}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_8px_0_rgba(30,64,175,0.25)] active:translate-y-[2px] active:shadow-[0_6px_0_rgba(30,64,175,0.25)] transition-all"
              >
                {photoPending ? 'Uploading...' : 'Change Photo'}
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="shadow-xl border border-blue-gray-100 overflow-hidden">
            <CardHeader floated={false} shadow={false} className="m-0 rounded-none bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Typography variant="h6" className="text-blue-gray-800">
                    Account
                  </Typography>
                  <Typography className="text-xs text-blue-gray-500 mt-1">
                    {user?.email || user?.mobilePhone || ''}
                  </Typography>
                </div>
                <div className="flex rounded-xl border border-blue-gray-100 bg-blue-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => switchTab('profile')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                      activeTab === 'profile'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                        : 'text-blue-gray-700 hover:bg-white'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => switchTab('security')}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                      activeTab === 'security'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                        : 'text-blue-gray-700 hover:bg-white'
                    }`}
                  >
                    Security
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardBody className="p-4 sm:p-6">
              {activeTab === 'profile' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Title" value={profileValues.title} onChange={(e) => setProfileValues((p) => ({ ...p, title: e.target.value }))} />
                    <Input label="Gender" value={profileValues.gender} onChange={(e) => setProfileValues((p) => ({ ...p, gender: e.target.value }))} />
                    <Input label="First Name" value={profileValues.firstName} onChange={(e) => setProfileValues((p) => ({ ...p, firstName: e.target.value }))} />
                    <Input label="Father Name" value={profileValues.fatherName} onChange={(e) => setProfileValues((p) => ({ ...p, fatherName: e.target.value }))} />
                    <Input label="Grand Father Name" value={profileValues.grandFatherName} onChange={(e) => setProfileValues((p) => ({ ...p, grandFatherName: e.target.value }))} />
                    <Input label="Phone" value={profileValues.mobilePhone} onChange={(e) => setProfileValues((p) => ({ ...p, mobilePhone: e.target.value }))} />
                    <div className="sm:col-span-2">
                      <Input label="Email" value={profileValues.email} onChange={(e) => setProfileValues((p) => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={onSaveProfile}
                      disabled={profilePending}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 shadow-[0_8px_0_rgba(4,120,87,0.25)] active:translate-y-[2px] active:shadow-[0_6px_0_rgba(4,120,87,0.25)] transition-all"
                    >
                      {profilePending ? 'Saving...' : 'Save changes'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        label="Old Password"
                        type="password"
                        value={securityValues.oldPassword}
                        onChange={(e) => setSecurityValues((p) => ({ ...p, oldPassword: e.target.value }))}
                      />
                    </div>
                    <Input
                      label="New Password"
                      type="password"
                      value={securityValues.newPassword}
                      onChange={(e) => setSecurityValues((p) => ({ ...p, newPassword: e.target.value }))}
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      value={securityValues.confirmPassword}
                      onChange={(e) => setSecurityValues((p) => ({ ...p, confirmPassword: e.target.value }))}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={onChangePassword}
                      disabled={securityPending}
                      className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 shadow-[0_8px_0_rgba(180,83,9,0.25)] active:translate-y-[2px] active:shadow-[0_6px_0_rgba(180,83,9,0.25)] transition-all"
                    >
                      {securityPending ? 'Updating...' : 'Change password'}
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
